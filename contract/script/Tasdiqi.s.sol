// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.33;

import {Script} from "forge-std/Script.sol";
import {Tasdiqi} from "../src/Tasdiqi.sol";

contract DeployScript is Script {
    function run() public {
        address _address = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

        vm.startBroadcast();

        new Tasdiqi(_address);

        vm.stopBroadcast();
    }
}
