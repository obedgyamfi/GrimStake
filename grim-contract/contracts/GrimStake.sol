// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal ERC20 interface
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount)
        external
        returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool);
}

/**
 * @title GrimStake
 * @notice Multi-token staking vault with per-token reward rates.
 *         Users stake ERC20 tokens into pools; rewards are paid in the same token.
 *
 *         - Owner creates pools for specific token addresses.
 *         - Each pool has a rewardRate (tokens/second) funded by the owner.
 *         - Rewards use a MasterChef-style accRewardPerShare model.
 */
contract GrimStake {
    // ------------------------------------------------------
    // Basic Ownable
    // ------------------------------------------------------
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "GrimStake: not owner");
        _;
    }

    // ------------------------------------------------------
    // Simple Reentrancy Guard
    // ------------------------------------------------------
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier nonReentrant() {
        require(_status != _ENTERED, "GrimStake: reentrant");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    // ------------------------------------------------------
    // Staking Data Structures
    // ------------------------------------------------------
    struct TokenPool {
        bool    enabled;            // pool active
        uint256 rewardRate;         // tokens per second
        uint256 lastRewardTime;     // last time accRewardPerShare was updated
        uint256 accRewardPerShare;  // scaled by ACC_PRECISION
        uint256 totalStaked;        // total tokens staked in this pool
    }

    struct UserStake {
        uint256 amount;      // how many tokens the user has staked
        uint256 rewardDebt;  // amount*accRewardPerShare/ACC at last action
    }

    // token address => pool data
    mapping(address => TokenPool) public pools;

    // user => token => stake data
    mapping(address => mapping(address => UserStake)) public stakes;

    // rewards precision
    uint256 private constant ACC_PRECISION = 1e12;

    // ------------------------------------------------------
    // Events
    // ------------------------------------------------------
    event PoolCreated(address indexed token, uint256 rewardRate);
    event RewardRateUpdated(address indexed token, uint256 newRate);
    event Staked(address indexed user, address indexed token, uint256 amount);
    event Unstaked(address indexed user, address indexed token, uint256 amount);
    event RewardClaimed(address indexed user, address indexed token, uint256 amount);

    // ------------------------------------------------------
    // Constructor
    // ------------------------------------------------------
    constructor() {
        owner = msg.sender;
        _status = _NOT_ENTERED;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ------------------------------------------------------
    // Admin / Owner functions
    // ------------------------------------------------------

    /// @notice Transfer ownership to a new address.
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "GrimStake: zero owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Add a new staking pool for a token.
    /// @param token ERC20 token address to be staked.
    /// @param rewardRate Tokens per second distributed to stakers in this pool.
    function addPool(address token, uint256 rewardRate) external onlyOwner {
        require(token != address(0), "GrimStake: zero token");
        TokenPool storage p = pools[token];
        require(!p.enabled, "GrimStake: pool exists");

        p.enabled = true;
        p.rewardRate = rewardRate;
        p.lastRewardTime = block.timestamp;

        emit PoolCreated(token, rewardRate);
    }

    /// @notice Update the reward rate for an existing pool.
    function setRewardRate(address token, uint256 newRate) external onlyOwner {
        TokenPool storage p = pools[token];
        require(p.enabled, "GrimStake: pool not enabled");

        _updatePool(token);

        p.rewardRate = newRate;
        emit RewardRateUpdated(token, newRate);
    }

    /// @notice Owner can withdraw leftover reward tokens, if needed.
    function rescueTokens(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "GrimStake: zero to");
        _safeTransfer(IERC20(token), to, amount);
    }

    // ------------------------------------------------------
    // Core staking logic
    // ------------------------------------------------------

    /// @notice Stake `amount` of `token` into its pool.
    function stake(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "GrimStake: amount = 0");
        TokenPool storage p = pools[token];
        require(p.enabled, "GrimStake: pool not enabled");

        _updatePool(token);

        UserStake storage u = stakes[msg.sender][token];

        // Update user stake
        u.amount += amount;
        u.rewardDebt = (u.amount * p.accRewardPerShare) / ACC_PRECISION;

        p.totalStaked += amount;

        _safeTransferFrom(IERC20(token), msg.sender, address(this), amount);

        emit Staked(msg.sender, token, amount);
    }

    /// @notice Unstake `amount` of `token` from its pool (rewards remain claimable).
    function unstake(address token, uint256 amount) external nonReentrant {
        TokenPool storage p = pools[token];
        require(p.enabled, "GrimStake: pool not enabled");

        UserStake storage u = stakes[msg.sender][token];
        require(u.amount >= amount, "GrimStake: not enough staked");

        _updatePool(token);

        u.amount -= amount;
        u.rewardDebt = (u.amount * p.accRewardPerShare) / ACC_PRECISION;
        p.totalStaked -= amount;

        _safeTransfer(IERC20(token), msg.sender, amount);

        emit Unstaked(msg.sender, token, amount);
    }

    /// @notice Claim all pending rewards for a token pool.
    function claim(address token) external nonReentrant {
        TokenPool storage p = pools[token];
        require(p.enabled, "GrimStake: pool not enabled");

        _updatePool(token);

        UserStake storage u = stakes[msg.sender][token];

        uint256 accumulated = (u.amount * p.accRewardPerShare) / ACC_PRECISION;
        uint256 pending = accumulated - u.rewardDebt;
        require(pending > 0, "GrimStake: no rewards");

        u.rewardDebt = accumulated;

        _safeTransfer(IERC20(token), msg.sender, pending);

        emit RewardClaimed(msg.sender, token, pending);
    }

    /// @notice Convenience: claim rewards for multiple tokens in one call.
    function claimMany(address[] calldata tokens_) external nonReentrant {
        uint256 len = tokens_.length;
        for (uint256 i = 0; i < len; i++) {
            address token = tokens_[i];
            TokenPool storage p = pools[token];
            if (!p.enabled) continue;

            _updatePool(token);

            UserStake storage u = stakes[msg.sender][token];
            uint256 accumulated = (u.amount * p.accRewardPerShare) / ACC_PRECISION;
            uint256 pending = accumulated - u.rewardDebt;
            if (pending == 0) continue;

            u.rewardDebt = accumulated;
            _safeTransfer(IERC20(token), msg.sender, pending);

            emit RewardClaimed(msg.sender, token, pending);
        }
    }

    // ------------------------------------------------------
    // Views for frontend
    // ------------------------------------------------------

    /// @notice Pending rewards for a user in a given pool.
    function pendingRewards(address user, address token) external view returns (uint256) {
        TokenPool storage p = pools[token];
        UserStake storage u = stakes[user][token];

        if (!p.enabled) return 0;

        uint256 acc = p.accRewardPerShare;
        if (block.timestamp > p.lastRewardTime && p.totalStaked != 0) {
            uint256 timeDelta = block.timestamp - p.lastRewardTime;
            uint256 reward = timeDelta * p.rewardRate;
            acc += (reward * ACC_PRECISION) / p.totalStaked;
        }

        uint256 accumulated = (u.amount * acc) / ACC_PRECISION;
        return accumulated - u.rewardDebt;
    }

    /// @notice Return basic stats for a pool (for analytics UI).
    /// @dev APR is a rough estimate using rewardRate and totalStaked (basis points).
    function getPoolStats(address token)
        external
        view
        returns (
            uint256 totalStaked,
            uint256 rewardRate,
            uint256 aprBps
        )
    {
        TokenPool storage p = pools[token];
        totalStaked = p.totalStaked;
        rewardRate = p.rewardRate;

        if (p.totalStaked == 0 || p.rewardRate == 0) {
            aprBps = 0;
        } else {
            // APR ≈ (rewardRate * 365 days / totalStaked) * 10000
            aprBps = (p.rewardRate * 365 days * 10000) / p.totalStaked;
        }
    }

    /// @notice Return user's staked amount and rewardDebt (for debugging / UI).
    function getUserStake(address user, address token)
        external
        view
        returns (uint256 amount, uint256 rewardDebt)
    {
        UserStake storage u = stakes[user][token];
        amount = u.amount;
        rewardDebt = u.rewardDebt;
    }

    // ------------------------------------------------------
    // Internal helpers
    // ------------------------------------------------------

    function _updatePool(address token) internal {
        TokenPool storage p = pools[token];
        if (!p.enabled) return;

        if (block.timestamp <= p.lastRewardTime) {
            return;
        }

        if (p.totalStaked == 0) {
            p.lastRewardTime = block.timestamp;
            return;
        }

        uint256 timeDelta = block.timestamp - p.lastRewardTime;
        uint256 reward = timeDelta * p.rewardRate;

        p.accRewardPerShare += (reward * ACC_PRECISION) / p.totalStaked;
        p.lastRewardTime = block.timestamp;
    }

    function _safeTransfer(IERC20 token, address to, uint256 amount) internal {
        if (amount == 0) return;
        (bool success, bytes memory data) =
            address(token).call(abi.encodeWithSelector(token.transfer.selector, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "GrimStake: transfer failed");
    }

    function _safeTransferFrom(IERC20 token, address from, address to, uint256 amount) internal {
        if (amount == 0) return;
        (bool success, bytes memory data) =
            address(token).call(abi.encodeWithSelector(token.transferFrom.selector, from, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "GrimStake: transferFrom failed");
    }
}

