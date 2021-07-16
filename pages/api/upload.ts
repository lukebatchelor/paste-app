import path from 'path';
import formidable from 'formidable';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';

const prismaClient = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).send('Unauthorized');

  const form = new formidable.IncomingForm();
  form.uploadDir = process.env.UPLOAD_DIR;
  form.keepExtensions = true;
  try {
    const file: any = await new Promise((resolve, reject) => {
      form.parse(req, (err, _, parsed) => {
        if (err) reject();
        resolve(parsed.file);
      });
    });
    console.log('File', file);
    console.log(Object.keys(file));
    const fileName = path.basename(file.path);
    const message = await prismaClient.message.create({
      data: { textBody: fileName, imageName: fileName, userId: session.user.id },
    });
    res.status(200).send({ message });
  } catch (e) {
    console.error(e);
    res.status(500).send({ err: e });
  }
};

export default handler;
