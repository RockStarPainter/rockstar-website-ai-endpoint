const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name_phoneNo_address } = req.body;

  if (!name_phoneNo_address) {
    return res
      .status(400)
      .json({ error: "Missing required field: name_phoneNo_address" });
  }

  const [name, phoneNo, address] = name_phoneNo_address.split("_");

  if (!name || !phoneNo || !address) {
    return res
      .status(400)
      .json({ error: "Invalid format for name_phoneNo_address" });
      
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.EMAIL_TO;

  if (
    !smtpHost ||
    !smtpPort ||
    !smtpUser ||
    !smtpPass ||
    !emailFrom ||
    !emailTo
  ) {
    return res
      .status(500)
      .json({ error: "Server configuration is incomplete" });
  }

  let transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  let mailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: `New Lead from Rockstar AI - ${name}`,
    text: `
      Hi Admin,

      You have a new lead from Rockstar AI.

      Name: ${name}
      Phone No: ${phoneNo}
      Address: ${address}

      Please engage at your earliest convenience.

      Best,
      AI Assistant
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
