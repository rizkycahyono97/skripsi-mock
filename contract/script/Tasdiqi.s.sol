// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {Tasdiqi} from "../src/Tasdiqi.sol";

contract DeployScript is Script {
    function run() public {
        // Alamat dFF0... akan menjadi msg.sender saat broadcast dimulai
        // dan otomatis menjadi 'owner' di OpenZeppelin v4.9.6
        vm.startBroadcast();

        // PENYESUAIAN: Hapus argumen _address karena constructor
        // Tasdiqi sekarang tidak menerima parameter (empty constructor).
        new Tasdiqi();

        vm.stopBroadcast();
    }
}
