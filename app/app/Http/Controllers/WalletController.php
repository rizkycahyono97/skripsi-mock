<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Elliptic\EC;
use Exception;
use Illuminate\Support\Facades\Crypt;
use kornrunner\Keccak;

class WalletController extends Controller
{
    /**
     * generate wallet Ethereum untuk user tertentu
     */
    public function generateWallet(User $user)
    {
        if ($user->wallet) {
            return back()->withErrors(['wallet' => 'User ini sudah memiliki wallet digital']);
        }

        try {

            $ec = new EC('secp256k1');
            $keyPair = $ec->genKeyPair();  // generate pasangan kunci

            $privateKeyHex = str_pad($keyPair->getPrivate()->toString(16), 64, '0', STR_PAD_LEFT); // exstrak private key 64 hex / 32 bytes

            $publicKeyHex = $keyPair->getPublic()->encode('hex'); // exktrak public key, tanpa previk 04
            $uncompressedPublicKey = substr($publicKeyHex, 2);

            // ethreum address 40bit
            $hash = Keccak::hash(hex2bin($uncompressedPublicKey), 256);
            $ethereumAddress = '0x'.substr($hash, -40);

            $wallet = Wallet::create([
                'user_id' => $user->id,
                'public_address' => $ethereumAddress,
                'encrypted_private_address' => Crypt::encryptString($privateKeyHex),
            ]);

            return back()->with(['success', 'Wallet crypto berhasil di generate. public address '.$wallet->public_address]);

        } catch (Exception $e) {
            report($e);

            return back()->withErrors(['system' => 'Gagal memgenerate wallet address cypto']);
        }
    }
}
