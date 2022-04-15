<?php
require_once __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$pdo = require 'connect.php';

$date = date("d-m-Y");
$time = date("H:i:s");
$dt = $date." ".$time;
echo "[".$dt."] RUN \n";
$client = new \GuzzleHttp\Client();
$url = 'https://kelola.p2dd.go.id/p2dd/api/TemplateData/keluaran/1620.json';
$response = $client->request('GET', $url, ['verify' => false]);
$body = json_decode($response->getBody());
$items = $body->data->items;
// printf($date);
// print_r($items);

foreach ($items as $k => $v) {
    if ($v->tgl_akhir == $date) {
        echo "[".$dt."] ============================================".PHP_EOL;
        echo "[".$dt."] Update status pelaporan menjadi di proses.\n";
        $affectedRows = update($pdo, $v->id);
        // $affectedRows = 1;
        echo "[".$dt."] Number of row affected " . $affectedRows ."\n";
        echo "[".$dt."] Update selesai.\n";
        $data = select($pdo, $v->id);
        foreach ($data as $key => $value) {
            echo "[".$dt."] ============================================".PHP_EOL;
            echo "[".$dt."] Mulai mengirim email ke ".$value["email"]."\n";
            // Email data
            $to = $value["email"];
            $subject = "Kuisoner Telah Terkirim";
            $body = "<p>Kuesioner telah terkirim dengan hasil yang sudah terisikan sebagai berikut:</p>";
            $body .= "<p>Email: ".$value["email"]."</p>";
            $body .= "<p>1. Tingkat Pemerintah Daerah: ".$value["tingkat_pemerintah_daerah"]."</p>";
            $body .= "<p>2. Nama Provinsi/Kota/Kabupaten: ".$value["nama_daerah"]."</p>";
            $body .= "<p>3. Kantor Perwakilan Bank Indonesia Dalam Negeri: ".$value["kpwdn"]."</p>";
            $body .= "<p>4. Nama Petugas Pengisi: ".$value["nama_petugas"]."</p>";
            $body .= "<p>5. Nomor Induk Pegawai: ".$value["nip"]."</p>";
            $body .= "<p>6. Nomor kontak responden yang dapat dihubungi: ".$value["nomor_kontak"]."</p>";
            $body .= "<p><strong>A. Informasi Umum</strong></p>";
            $body .= "<p>1. Total Target Pendapatan Asli Daerah (Rp): ".$value["total_target_pendapatan_asli_daerah"]."</p>";
            $body .= "<p>2. Total Realisasi Pendapatan Asli Daerah (Rp): ".$value["total_realisasi_pendapatan_asli_daerah"]."</p>";
            $body .= "<p>3. Total Target Pajak Daerah (Rp): ".$value["total_target_pajak_daerah"]."</p>";
            $body .= "<p>4. Total Realisasi Pajak Daerah (Rp): ".$value["total_realisasi_pajak_daerah"]."</p>";
            $body .= "<p>5. Total Target Retribusi Daerah (Rp): ".$value["total_target_retribusi_daerah"]."</p>";
            $body .= "<p>6. Total Realisasi Retribusi Daerah (Rp): ".$value["total_realisasi_retribusi_daerah"]."</p>";
            $body .= "<p>7. Total Pagu Belanja Daerah (Rp): ".$value["total_pagu_belanja_daerah"]."</p>";
            $body .= "<p>8. Total Realisasi Belanja Daerah (Rp): ".$value["total_realisasi_belanja_daerah"]."</p>";
            $body .= "<p>9. Total Pagu Belanja Operasi (Rp): ".$value["total_pagu_belanja_operasi"]."</p>";
            $body .= "<p>10. Total Realisasi Belanja Operasi (Rp): ".$value["total_realisasi_belanja_operasi"]."</p>";
            $body .= "<p>11. Total Pagu Belanja Modal (Rp): ".$value["total_pagu_belanja_modal"]."</p>";
            $body .= "<p>12. Total Realisasi Belanja Modal (Rp): ".$value["total_realisasi_belanja_modal"]."</p>";
            $body .= "<p>13. Total Pagu Belanja Tidak Terduga (Rp): ".$value["total_pagu_belanja_tidak_terduga"]."</p>";
            $body .= "<p>14. Total Realisasi Belanja Tidak Terduga (Rp): ".$value["total_realisasi_belanja_tidak_terduga"]."</p>";
            $body .= "<p>15. Total Pagu Belanja Transfer (Rp): ".$value["total_pagu_belanja_transfer"]."</p>";
            $body .= "<p>16. Total Realisasi Belanja Transfer (Rp): ".$value["total_realisasi_belanja_transfer"]."</p>";
            $body .= "<p><strong>B. Transaksi Belanja Pemda</strong></p>";
            $body .= "<p>1. Berikut adalah transaksi belanja langsung yang telah dapat dilakukan secara elektronifikasi</p>";
            $body .= "<p>Belanja Pegawai: ".$value["belanja_pegawai_langsung"]."</p>";
            $body .= "<p>Belanja Barang Dan Jasa: ".$value["belanja_barang_dan_jasa_langsung"]."</p>";
            $body .= "<p>Belanja Modal: ".$value["belanja_modal_langsung"]."</p>";
            $body .= "<p>2. Berikut adalah transaksi belanja tidak langsung yang telah dapat dilakukan secara elektronifikasi</p>";
            $body .= "<p>Belanja Pegawai: ".$value["belanja_pegawai_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Bunga: ".$value["belanja_bunga_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Subsidi: ".$value["belanja_subsidi_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Hibah: ".$value["belanja_hibah_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Bantuan Sosial: ".$value["belanja_bantuan_sosial_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Bagi Hasil: ".$value["belanja_bagi_hasil_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Bantuan Keuangan: ".$value["belanja_bantuan_keuangan_tidak_langsung"]."</p>";
            $body .= "<p>Belanja Tidak Terduga: ".$value["belanja_tidak_terduga_tidak_langsung"]."</p>";
            $body .= "<br>";
            // Email data end
            // sendEmail($to, $subject, $body);
            sendEmail2($to, $subject, $body);
            // echo "[".$dt."] Email terkirim ke ".$to."\n";
        }
    }
}
echo "[".$dt."] STOP\n";

function update($pdo, $id) {
    $sql = "UPDATE index_etpd SET status='proses' WHERE periode_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id);
    $stmt->execute();
    return $stmt->rowCount();
}

function select($pdo, $id) {
    $sql = "SELECT * FROM index_etpd WHERE periode_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id);
    $stmt->execute();
    $data = [];
    while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
        $data[] = [
            'id' => $row['id'],
            'instansi_id' => $row['instansi_id'],
            'email' => $row['email'],
            'periode_id' => $row['periode_id'],
            'status' => $row['status'],
            'nama_petugas' => $row['nama_petugas'],
            'nip' => $row['nip'],
            'nomor_kontak' => $row['nomor_kontak'],
            'total_target_pendapatan_asli_daerah' => $row['total_target_pendapatan_asli_daerah'],
            'total_realisasi_pendapatan_asli_daerah' => $row['total_realisasi_pendapatan_asli_daerah'],
            'total_target_pajak_daerah' => $row['total_target_pajak_daerah'],
            'total_realisasi_pajak_daerah' => $row['total_realisasi_pajak_daerah'],
            'total_target_retribusi_daerah' => $row['total_target_retribusi_daerah'],
            'total_realisasi_retribusi_daerah' => $row['total_realisasi_retribusi_daerah'],
            'total_pagu_belanja_daerah' => $row['total_pagu_belanja_daerah'],
            'total_realisasi_belanja_daerah' => $row['total_realisasi_belanja_daerah'],
            'total_pagu_belanja_operasi' => $row['total_pagu_belanja_operasi'],
            'total_realisasi_belanja_operasi' => $row['total_realisasi_belanja_operasi'],
            'total_pagu_belanja_modal' => $row['total_pagu_belanja_modal'],
            'total_realisasi_belanja_modal' => $row['total_realisasi_belanja_modal'],
            'total_pagu_belanja_tidak_terduga' => $row['total_pagu_belanja_tidak_terduga'],
            'total_realisasi_belanja_tidak_terduga' => $row['total_realisasi_belanja_tidak_terduga'],
            'total_pagu_belanja_transfer' => $row['total_pagu_belanja_transfer'],
            'belanja_pegawai_langsung' => $row['belanja_pegawai_langsung'],
            'belanja_barang_dan_jasa_langsung' => $row['belanja_barang_dan_jasa_langsung'],
            'belanja_modal_langsung' => $row['belanja_modal_langsung'],
            'belanja_pegawai_tidak_langsung' => $row['belanja_pegawai_tidak_langsung'],
            'belanja_bunga_tidak_langsung' => $row['belanja_bunga_tidak_langsung'],
            'belanja_subsidi_tidak_langsung' => $row['belanja_subsidi_tidak_langsung'],
            'belanja_hibah_tidak_langsung' => $row['belanja_hibah_tidak_langsung'],
            'belanja_bantuan_sosial_tidak_langsung' => $row['belanja_bantuan_sosial_tidak_langsung'],
            'belanja_bagi_hasil_tidak_langsung' => $row['belanja_bagi_hasil_tidak_langsung'],
            'belanja_bantuan_keuangan_tidak_langsung' => $row['belanja_bantuan_keuangan_tidak_langsung'],
            'belanja_tidak_terduga_tidak_langsung' => $row['belanja_tidak_terduga_tidak_langsung'],
            'kendaraan_bermotor' => $row['kendaraan_bermotor'],
            'bea_balik_nama_kendaraan_bermotor' => $row['bea_balik_nama_kendaraan_bermotor'],
            'bahan_bakar_kendaraan_bermotor' => $row['bahan_bakar_kendaraan_bermotor'],
            'air_permukaan' => $row['air_permukaan'],
            'rokok' => $row['rokok'],
            'hotel' => $row['hotel'],
            'restoran' => $row['restoran'],
            'hiburan' => $row['hiburan'],
            'reklame' => $row['reklame'],
            'penerangan_jalan' => $row['penerangan_jalan'],
            'mineral_bukan_logam' => $row['mineral_bukan_logam'],
            'parkir' => $row['parkir'],
            'air_tanah' => $row['air_tanah'],
            'sarang_burung_walet' => $row['sarang_burung_walet'],
            'pbb_desa_kota' => $row['pbb_desa_kota'],
            'bea_hak_tanah_bangunan' => $row['bea_hak_tanah_bangunan'],
            'pelayanan_kesehatan' => $row['pelayanan_kesehatan'],
            'pelayanan_kebersihan' => $row['pelayanan_kebersihan'],
            'pelayanan_pemakaman' => $row['pelayanan_pemakaman'],
            'parkir_jalan_umum' => $row['parkir_jalan_umum'],
            'pelayanan_pasar' => $row['pelayanan_pasar'],
            'pengujian_kendaraan_bermotor' => $row['pengujian_kendaraan_bermotor'],
            'pemeriksaan_alat_pemadam' => $row['pemeriksaan_alat_pemadam'],
            'penggantian_biaya_cetak_peta' => $row['penggantian_biaya_cetak_peta'],
            'penyedotan_kakus' => $row['penyedotan_kakus'],
            'pengolahan_limbah_cair' => $row['pengolahan_limbah_cair'],
            'pelayanan_tera' => $row['pelayanan_tera'],
            'pelayanan_pendidikan' => $row['pelayanan_pendidikan'],
            'pengendalian_menara_telekomunikasi' => $row['pengendalian_menara_telekomunikasi'],
            'pengendalian_lalu_lintas' => $row['pengendalian_lalu_lintas'],
            'pemakaian_kekayaan_daerah' => $row['pemakaian_kekayaan_daerah'],
            'pasar_grosir' => $row['pasar_grosir'],
            'tempat_pelelangan' => $row['tempat_pelelangan'],
            'terminal' => $row['terminal'],
            'tempat_khusus_parkir' => $row['tempat_khusus_parkir'],
            'tempat_penginapan' => $row['tempat_penginapan'],
            'rumah_potong_hewan' => $row['rumah_potong_hewan'],
            'pelayanan_pelabuhan' => $row['pelayanan_pelabuhan'],
            'tempat_rekreasi' => $row['tempat_rekreasi'],
            'penyebrangan_diair' => $row['penyebrangan_diair'],
            'penjualan_produksi_usaha' => $row['penjualan_produksi_usaha'],
            'izin_persetujuan_bangunan' => $row['izin_persetujuan_bangunan'],
            'izin_tempat_penjualan_minuman' => $row['izin_tempat_penjualan_minuman'],
            'izin_trayek' => $row['izin_trayek'],
            'izin_usaha_perikanan' => $row['izin_usaha_perikanan'],
            'perpanjangan_imta' => $row['perpanjangan_imta'],
            'teller_loket_bank' => $row['teller_loket_bank'],
            'agen_bank' => $row['agen_bank'],
            'atm' => $row['atm'],
            'edc' => $row['edc'],
            'uereader' => $row['uereader'],
            'internet_mobile_sms_banking' => $row['internet_mobile_sms_banking'],
            'qris' => $row['qris'],
            'ecommerce' => $row['ecommerce'],
            'nama_bank_rkud' => $row['nama_bank_rkud'],
            'total_pajak_daerah_dari_qris' => $row['total_pajak_daerah_dari_qris'],
            'total_pajak_daerah_dari_non_digital' => $row['total_pajak_daerah_dari_non_digital'],
            'total_pajak_daerah_dari_atm' => $row['total_pajak_daerah_dari_atm'],
            'total_pajak_daerah_dari_edc' => $row['total_pajak_daerah_dari_edc'],
            'total_pajak_daerah_dari_internet' => $row['total_pajak_daerah_dari_internet'],
            'total_pajak_daerah_dari_agen_bank' => $row['total_pajak_daerah_dari_agen_bank'],
            'total_pajak_daerah_dari_uereader' => $row['total_pajak_daerah_dari_uereader'],
            'total_pajak_daerah_dari_ecommerce' => $row['total_pajak_daerah_dari_ecommerce'],
            'total_retribusi_daerah_dari_qris' => $row['total_retribusi_daerah_dari_qris'],
            'total_retribusi_daerah_dari_non_digital' => $row['total_retribusi_daerah_dari_non_digital'],
            'total_retribusi_daerah_dari_atm' => $row['total_retribusi_daerah_dari_atm'],
            'total_retribusi_daerah_dari_edc' => $row['total_retribusi_daerah_dari_edc'],
            'total_retribusi_daerah_dari_internet' => $row['total_retribusi_daerah_dari_internet'],
            'total_retribusi_daerah_dari_agen_bank' => $row['total_retribusi_daerah_dari_agen_bank'],
            'total_retribusi_daerah_dari_uereader' => $row['total_retribusi_daerah_dari_uereader'],
            'total_retribusi_daerah_dari_ecommerce' => $row['total_retribusi_daerah_dari_ecommerce'],
            'sistem_informasi_pendapatan_daerah' => $row['sistem_informasi_pendapatan_daerah'],
            'sistem_informasi_belanja_daerah' => $row['sistem_informasi_belanja_daerah'],
            'integrasi_sipd' => $row['integrasi_sipd'],
            'sp2d_online' => $row['sp2d_online'],
            'integrasi_cms' => $row['integrasi_cms'],
            'integrasi_cms_dengan_pemda' => $row['integrasi_cms_dengan_pemda'],
            'regulasi_elektronifikasi' => $row['regulasi_elektronifikasi'],
            'regulasi_yang_dimiliki' => $row['regulasi_yang_dimiliki'],
            'sosialisasi_pembayaran_nontunai' => $row['sosialisasi_pembayaran_nontunai'],
            'rencana_pengembangan_etpd' => $row['rencana_pengembangan_etpd'],
            'blankspot' => $row['blankspot'],
            'wilayah_blankspot' => $row['wilayah_blankspot'],
            'jaringan_2g' => $row['jaringan_2g'],
            'jaringan_3g' => $row['jaringan_3g'],
            'jaringan_4g' => $row['jaringan_4g'],
            'kerjasama_pemungutan_pajak' => $row['kerjasama_pemungutan_pajak'],
            'kendala_pelaksanaan_etpd' => $row['kendala_pelaksanaan_etpd'],
            'telah_membentuk_tp2dd' => $row['telah_membentuk_tp2dd'],
            'landasan_hukum_pembentukan_tp2dd' => $row['landasan_hukum_pembentukan_tp2dd'],
            'dibantu_oleh_bank' => $row['dibantu_oleh_bank'],
            'dibuat_oleh' => $row['dibuat_oleh'],
            'tgl_dibuat' => $row['tgl_dibuat'],
            'diubah_oleh' => $row['diubah_oleh'],
            'tgl_diubah' => $row['tgl_diubah'],
            'total_realisasi_belanja_transfer' => $row['total_realisasi_belanja_transfer'],
            'sistem_informasi_pendapatan_daerah_other' => $row['sistem_informasi_pendapatan_daerah_other'],
            'sistem_informasi_belanja_daerah_other' => $row['sistem_informasi_belanja_daerah_other'],
            'kendala_pelaksanaan_etpd_other' => $row['kendala_pelaksanaan_etpd_other'],
            'kerjasama_pemungutan_pajak_other' => $row['kerjasama_pemungutan_pajak_other'],
            'tingkat_pemerintah_daerah' => $row['tingkat_pemerintah_daerah'],
            'nama_daerah' => $row['nama_daerah'],
            'kpwdn' => $row['kpwdn']
        ];
    }
    return $data;
}

function sendEmail($to, $subject, $body)
{
    $transport = Transport::fromDsn('smtp://p2dd:Yno0MzB5amtkMTAw@mail.smtp2go.com:2525');
    $mailer = new Mailer($transport);
    
    $email = (new Email())
        ->from('postmaster@p2dd.go.id')
        ->to($to)
        //->cc('cc@example.com')
        //->bcc('bcc@example.com')
        //->replyTo('fabien@example.com')
        //->priority(Email::PRIORITY_HIGH)
        ->subject($subject)
        // ->text('Sending emails is fun again!')
        ->html($body);
    
    try {
        $mailer->send($email);
        if($sendEmail)
        {
            echo "[".date("d-m-Y")." ".date("H:i:s")."] Email terkirim ke ".$to."\n";
        } else {
            print_r($sendEmail);
            echo "[".date("d-m-Y")." ".date("H:i:s")."] Email gagal terkirim ke ".$to."\n";
        }
    } catch (TransportExceptionInterface $e) {
        // some error prevented the email sending; display an
        // error message or try to resend the message
        print_r($e);
    }
}

function sendEmail2($to, $subject, $body)
{
    $mail = new PHPMailer(true);

    //Enable SMTP debugging.
    // $mail->SMTPDebug = 3;                               
    //Set PHPMailer to use SMTP.
    // $mail->isSMTP();            
    //Set SMTP host name                          
    // $mail->Host = "mail.smtp2go.com";
    //Set this to true if SMTP host requires authentication to send email
    // $mail->SMTPAuth = true;                          
    //Provide username and password     
    // $mail->Username = "p2dd";                 
    // $mail->Password = "Yno0MzB5amtkMTAw";                           
    //If SMTP requires TLS encryption then set it
    // $mail->SMTPSecure = "tls";                           
    //Set TCP port to connect to
    // $mail->Port = 2525;                                   

    // $mail->From = "postmaster@p2dd.go.id";
    // $mail->FromName = "P2DD";
    $mail->setFrom('postmaster@p2dd.go.id', 'P2DD');
    $mail->addAddress($to);

    $mail->isHTML(true);

    $mail->Subject = $subject;
    $mail->Body = $body;
    // $mail->AltBody = "This is the plain text version of the email content";

    try {
        $mail->send();
        echo "Message has been sent successfully\n";
    } catch (Exception $e) {
        echo "Mailer Error: " . $mail->ErrorInfo;
    }
}
