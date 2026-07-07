<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Elliptic\EC;
use Exception;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use kornrunner\Keccak;

class WalletController extends Controller
{
    /**
     * post ke API untuk set validator
     */
    public function generateAndActivateWallet(User $user)
    {
        if ($user->wallet) {
            return back()->withErrors(['wallet' => 'User ini sudah memiliki wallet digital']);
        }

        try {

            $keys = $this->generateWallet();

            $response = Http::timeout(30)
                ->withHeaders([
                    'x-api-key' => config('api.blockchain.key'),
                ])
                ->post(config('api.blockchain.url').'/documents/validator', [
                    'validatorAddress' => $keys['public_address'],
                    'status' => true,
                ]);

            if ($response->failed()) {
                $errorMsg = $response->json('message') ?? 'Error API set-validator';
                throw new Exception($errorMsg);
            }

            Wallet::create([
                'user_id' => $user->id,
                'public_address' => $keys['public_address'],
                'encrypted_private_key' => Crypt::encryptString($keys['private_key']),
            ]);

            return back()->with('success', 'Dompet berhasil dibuat dan staf telah resmi menjadi Validator di Blockchain!');

        } catch (Exception $e) {
            report($e);

            return back()->withErrors(['system' => 'Gagal memgenerate wallet address cypto, '.$e->getMessage()]);
        }
    }

    /**
     * generate wallet Ethereum untuk user tertentu
     */
    private function generateWallet()
    {

        $ec = new EC('secp256k1');
        $keyPair = $ec->genKeyPair();  // generate pasangan kunci

        $privateKeyHex = str_pad($keyPair->getPrivate()->toString(16), 64, '0', STR_PAD_LEFT); // exstrak private key 64 hex / 32 bytes

        $publicKeyHex = $keyPair->getPublic()->encode('hex'); // exktrak public key, tanpa previk 04
        $uncompressedPublicKey = substr($publicKeyHex, 2);

        // ethreum address 40bit
        $hash = Keccak::hash(hex2bin($uncompressedPublicKey), 256);
        $ethereumAddress = '0x'.substr($hash, -40);

        return [
            'private_key' => $privateKeyHex,
            'public_address' => $ethereumAddress,
        ];
    }
}
