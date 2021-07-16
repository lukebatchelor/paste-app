import { NextApiHandler } from 'next';
import { prisma, PrismaClient } from '@prisma/client';
// import { DeleteCheckinsReq } from 'typings/api';
import { getSession } from 'next-auth/client';

const prismaClient = new PrismaClient();

const createMessage: NextApiHandler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const { text }: PostMessageReq = req.body;
    const message = await prismaClient.message.create({
      data: { textBody: text, userId: session.user.id },
    });
    return res.status(200).send({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).end('Internal server error');
  }
};

const getMessages: NextApiHandler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const messages = await prismaClient.message.findMany({ where: { userId: session.user.id } });
    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).end('Internal server error');
  }
};

const editMessage: NextApiHandler = async (req, res) => {
  try {
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).end('Internal server error');
  }
};

const deleteMessage: NextApiHandler = async (req, res) => {
  try {
    // const { checkinId }: DeleteCheckinsReq = JSON.parse(req.body);
    // await prismaClient.checkin.delete({ where: { id: checkinId } });
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).end('Internal server error');
  }
};

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      return createMessage(req, res);
    case 'GET':
      return getMessages(req, res);
    case 'PUT':
      return editMessage(req, res);
    case 'DELETE':
      return deleteMessage(req, res);
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
      });
  }
};

export default handler;
