//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault is Ownable {
    using Address for address;
    using SafeERC20 for IERC20;

    address public constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    mapping(address => mapping(address => uint256)) private _balances;

    /**
     * @notice Emitted when user has deposited.
     * @param user The user address
     * @param token The token address
     * @param amount The deposited amount
     */
    event Deposit(address indexed user, address indexed token, uint256 amount);

    /**
     * @notice Emitted when user has withdrawn.
     * @param user The user address
     * @param token The token address
     * @param amount The withdrawn amount
     */
    event Withdrawal(address indexed user, address indexed token, uint256 amount);

    /**
     * @notice Get the token balance of user
     * @param user The user address
     * @param token The token address
     * @return The balance of user
     */
    function balanceOf(address user, address token) external view returns (uint256) {
        return _balances[user][token];
    }

    /**
     * @notice Deposit native token
     */
    function depositNativeToken() external payable {
        _deposit(NATIVE_TOKEN, msg.value);
    }

    /**
     * @notice Deposit ERC20 token
     * @param token The token address
     * @param amount The token amount
     */
    function deposit(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _deposit(token, amount);
    }

    /**
     * @notice Deposit native token
     * @param amount The native token amount
     */
    function withdrawNativeToken(uint256 amount) external {
        _withdraw(NATIVE_TOKEN, amount);
        payable(msg.sender).transfer(amount);
    }

    /**
     * @notice Withdraw ERC20 token
     * @param token The token address
     * @param amount The token amount
     */
    function withdraw(address token, uint256 amount) external {
        _withdraw(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    /**
     * @notice Deposit token
     * @param token The token address
     * @param amount The token amount
     */
    function _deposit(address token, uint256 amount) internal {
        unchecked {
            _balances[msg.sender][token] += amount;
        }
        emit Deposit(msg.sender, token, amount);
    }

    /**
     * @notice Withdraw token
     * @param token The token address
     * @param amount The token amount
     */
    function _withdraw(address token, uint256 amount) internal {
        require(_balances[msg.sender][token] >= amount, "withdrawal amount exceeds balance");
        _balances[msg.sender][token] -= amount;
        emit Withdrawal(msg.sender, token, amount);
    }
}
