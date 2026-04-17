<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Daten auffangen & säubern
    $name    = htmlspecialchars($_POST['name']);
    $email   = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $paket   = htmlspecialchars($_POST['paket']);
    $message = htmlspecialchars($_POST['message']);
    $kn      = htmlspecialchars($_POST['kundennummer']);

    // 2. Ziel-E-Mail
    $to = "info@irtona.de";
    $subject = "Neue Projektanfrage von $name [$kn]";

    // 3. E-Mail Inhalt (HTML Format)
    $email_content = "
    <html>
    <head><title>Anfrage von Irtona.de</title></head>
    <body>
        <h2 style='color: #0a0a0a;'>Neue Projektanfrage</h2>
        <p><strong>Kundennummer:</strong> $kn</p>
        <p><strong>Name/Unternehmen:</strong> $name</p>
        <p><strong>E-Mail:</strong> $email</p>
        <p><strong>Gewähltes Paket:</strong> $paket</p>
        <hr>
        <p><strong>Nachricht:</strong><br>" . nl2br($message) . "</p>
    </body>
    </html>
    ";

    // 4. Header für den E-Mail-Versand
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Irtona Webform <noreply@irtona.de>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    // 5. Versand
    if (mail($to, $subject, $email_content, $headers)) {
        // Erfolg: Weiterleitung zur Bestätigungsseite (oder Index mit Parameter)
        header("Location: index.html?status=success");
    } else {
        // Fehler
        header("Location: index.html?status=error");
    }
} else {
    // Direkter Aufruf verboten
    echo "Zugriff verweigert.";
}
?>