<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Daten auffangen & säubern
    $name    = htmlspecialchars($_POST['name']);
    $email   = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $paket   = htmlspecialchars($_POST['paket']);
    $message = htmlspecialchars($_POST['message']);
    $kn      = htmlspecialchars($_POST['kundennummer']); // Kommt vom JS

    // DEINE E-MAIL (INTERN)
    $to_admin = "info@irtona.de";
    $subject_admin = "Neue Projektanfrage: $name [$kn]";

    // KUNDEN E-MAIL (BESTÄTIGUNG)
    $to_customer = $email;
    $subject_customer = "Eingangsbestätigung: Deine Anfrage bei Irtona.de [$kn]";

    // Gemeinsame Header-Einstellungen
    $headers_base = "MIME-Version: 1.0" . "\r\n";
    $headers_base .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers_base .= "From: Irtona.de <info@irtona.de>" . "\r\n";

    // --- MAIL AN DICH (ADMIN) ---
    $message_admin = "
    <html>
    <body style='font-family: sans-serif; line-height: 1.6;'>
        <h2 style='color: #0a0a0a;'>Neue Anfrage erhalten</h2>
        <p><strong>Kundennummer:</strong> $kn</p>
        <p><strong>Name:</strong> $name</p>
        <p><strong>E-Mail:</strong> $email</p>
        <p><strong>Paket:</strong> $paket</p>
        <hr>
        <p><strong>Nachricht:</strong><br>" . nl2br($message) . "</p>
    </body>
    </html>";

    // --- MAIL AN KUNDEN (AUTO-REPLY) ---
    $message_customer = "
    <html>
    <body style='font-family: sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>
            <h2 style='color: #0a0a0a;'>Hallo $name,</h2>
            <p>vielen Dank für deine Nachricht! Wir haben deine Projektanfrage erhalten.</p>
            <p><strong>Deine Kundennummer für Rückfragen: $kn</strong></p>
            <p>Wir schauen uns deine Details nun in Ruhe an. Wie versprochen, melden wir uns innerhalb der nächsten <strong>24 Stunden</strong> bei dir zurück, um die nächsten Schritte zu besprechen.</p>
            <p>Falls du vorab noch Fragen hast, antworte einfach direkt auf diese E-Mail.</p>
            <br>
            <p>Beste Grüße aus Ludwigsburg,<br><strong>Dein Team von Irtona.de</strong></p>
            <hr style='border: 0; border-top: 1px solid #eee;'>
            <p style='font-size: 12px; color: #999;'>Irtona.de | Zukunftssicheres Webdesign | Ludwigsburg, DE</p>
        </div>
    </body>
    </html>";

    // 5. Beides versenden
    $mail_admin = mail($to_admin, $subject_admin, $message_admin, $headers_base);
    
    // Nur senden, wenn die Kunden-Email valide ist
    $mail_customer = mail($to_customer, $subject_customer, $message_customer, $headers_base);

    if ($mail_admin) {
        // Erfolg: Weiterleitung zur Startseite mit Erfolgs-Meldung
        header("Location: index.html?status=success#kontakt");
    } else {
        // Fehler
        header("Location: index.html?status=error#kontakt");
    }
} else {
    echo "Zugriff verweigert.";
}
?>
