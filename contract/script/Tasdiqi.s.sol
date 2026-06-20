// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {Tasdiqi} from "../src/Tasdiqi.sol";

contract DeployScript is Script {
    function run() public {
        vm.startBroadcast();

        new Tasdiqi();

        vm.stopBroadcast();
    }
}
