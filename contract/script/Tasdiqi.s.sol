// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.33;

import {Script} from "forge-std/Script.sol";
import {Tasdiqi} from "../src/Tasdiqi.sol";

contract DeployScript is Script {
    function run() public {
        address _address = 0xdFF038f8bD5F2b621985806838B9c8242aeb13e8;

        vm.startBroadcast();

        new Tasdiqi(_address);

        vm.stopBroadcast();
    }
}
