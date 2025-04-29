import nodemailer from 'nodemailer';

export async function sendEmailWithAttachment({ to, subject, text, attachments }: {
  to: string,
  subject: string,
  text: string,
  attachments: { filename: string, content: Buffer }[]
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "vickymuthunga@gmail.com", 
        pass: "phao chdg beqx cgla", 
      },
  });

  await transporter.sendMail({
    from: "vickymuthunga@gmail.com",
    to,
    subject,
    text,
    attachments
  });
}
