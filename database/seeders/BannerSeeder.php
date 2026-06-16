<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        // Data banner dikurasi dari aset produk https://zaskiamecca.com/.
        $now = now();
        $banners = [
        [
            'title' => 'ZM Zaskia Mecca - Bunga Pertiwi',
            'subtitle' => 'Scarf Voal Alaska Premium edisi pahlawan perempuan Indonesia.',
            'image_desktop_url' => 'https://cdn.shopify.com/s/files/1/0083/3241/0942/files/9028d5d5ac48461ea36182c1b41855d2_tplv-aphluv4xwc-origin-jpeg.jpg?v=1777517636',
            'image_mobile_url' => 'https://cdn.shopify.com/s/files/1/0083/3241/0942/files/9028d5d5ac48461ea36182c1b41855d2_tplv-aphluv4xwc-origin-jpeg.jpg?v=1777517636',
            'button_text' => 'Belanja Sekarang',
            'button_url' => '/list',
            'placement' => 'homepage',
            'sort_order' => '1',
            'is_active' => true,
        ],
        [
            'title' => 'Primadona Series',
            'subtitle' => 'Koleksi Raya ZM Zaskia Mecca untuk tampilan modest elegan.',
            'image_desktop_url' => 'https://cdn.shopify.com/s/files/1/0083/3241/0942/files/sg-11134201-825zr-ml31rmqs52io5f.webp?v=1771996057',
            'image_mobile_url' => 'https://cdn.shopify.com/s/files/1/0083/3241/0942/files/sg-11134201-825zr-ml31rmqs52io5f.webp?v=1771996057',
            'button_text' => 'Lihat Koleksi',
            'button_url' => '/collections/primadona-series',
            'placement' => 'homepage',
            'sort_order' => '2',
            'is_active' => true,
        ],
        [
            'title' => 'Jejak Teduh',
            'subtitle' => 'Motif Nusantara dalam scarf dan tunik ZM Zaskia Mecca.',
            'image_desktop_url' => 'https://cdn.shopify.com/s/files/1/0083/3241/0942/files/sg-11134201-8262w-ml3ns60k2vie4a.webp?v=1771996087',
            'image_mobile_url' => 'https://cdn.shopify.com/s/files/1/0083/3241/0942/files/sg-11134201-8262w-ml3ns60k2vie4a.webp?v=1771996087',
            'button_text' => 'Jelajahi',
            'button_url' => '/collections/jejak-teduh',
            'placement' => 'homepage',
            'sort_order' => '3',
            'is_active' => true,
        ],
        [
                'title'              => 'Koleksi Abaya Terbaru',
                'subtitle'           => 'Abaya Premium dengan Material Berkualitas Tinggi',
                'image_desktop_url'  => 'https://plus.unsplash.com/premium_photo-1676925875911-7f46961f8193?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'image_mobile_url'   => 'https://plus.unsplash.com/premium_photo-1676925875911-7f46961f8193?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'button_text'        => 'Shop Abaya',
                'button_url'         => '/list',
                'placement'          => 'collection',
                'sort_order'         => 1,
                'is_active'          => true,
                'starts_at'          => null,
                'ends_at'            => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
            [
                'title'              => 'Hijab & Khimar Pilihan',
                'subtitle'           => 'Warna-warna Elegan untuk Setiap Kesempatan',
                'image_desktop_url'  => 'https://images.unsplash.com/photo-1655909961998-7d92664b2ecb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'image_mobile_url'   => 'https://images.unsplash.com/photo-1655909961998-7d92664b2ecb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'button_text'        => 'Lihat Semua',
                'button_url'         => '/list',
                'placement'          => 'collection',
                'sort_order'         => 2,
                'is_active'          => true,
                'starts_at'          => null,
                'ends_at'            => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
                        [
                'title'              => 'Flash Sale — Up to 30% Off',
                'subtitle'           => 'Promo Terbatas! Dapatkan Penawaran Terbaik Hari Ini',
                'image_desktop_url'  => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&auto=format&fit=crop',
                'image_mobile_url'   => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=768&auto=format&fit=crop',
                'button_text'        => 'Klaim Diskon',
                'button_url'         => '/list',
                'placement'          => 'cta',
                'sort_order'         => 0,
                'is_active'          => true,
                'starts_at'          => null,
                'ends_at'            => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],


        ];
        foreach ($banners as $banner) {
            Banner::query()->updateOrCreate(['placement' => $banner['placement'], 'sort_order' => $banner['sort_order']], [...$banner, 'starts_at' => $now, 'ends_at' => $now->copy()->addDays(30)]);
        }
    }
}
