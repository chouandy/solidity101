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

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);

    function balanceOf(address user, address token) external view returns (uint256) {
        return _balances[user][token];
    }

    function depositNativeToken() external payable {
        _deposit(NATIVE_TOKEN, msg.value);
    }

    function deposit(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _deposit(token, amount);
    }

    function withdrawNativeToken(uint256 amount) external {
        _withdraw(NATIVE_TOKEN, amount);
        payable(msg.sender).transfer(amount);
    }

    function withdraw(address token, uint256 amount) external {
        _withdraw(token, amount);
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function _deposit(address token, uint256 amount) internal {
        unchecked {
            _balances[msg.sender][token] += amount;
        }
        emit Deposit(msg.sender, token, amount);
    }

    function _withdraw(address token, uint256 amount) internal {
        require(_balances[msg.sender][token] >= amount, "withdrawal amount exceeds balance");
        _balances[msg.sender][token] -= amount;
        emit Withdrawal(msg.sender, token, amount);
    }
}
