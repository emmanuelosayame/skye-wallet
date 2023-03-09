import { prisma } from "../../lib/prisma";
import { Router } from "express";
import { customAlphabet } from "nanoid";
import { validate } from "../../src/middleware";
import { pidSchema, userSchema, dpidSchema } from "../../src/schema/user";
import { hash } from "bcrypt";
const router = Router();

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789");

const saltRounds = 10;

router.post("/create", validate(userSchema), async (req, res) => {
  const paymentId = nanoid(7);
  const { name, phone, email, password } = req.body;
  const hashedPassword = await hash(password, saltRounds);
  try {
    res.status(200).json(
      await prisma.user.create({
        data: {
          paymentIds: [paymentId],
          name,
          phone,
          email,
          password: hashedPassword,
        },
        select: { email: true, name: true, paymentIds: true, phone: true },
      })
    );
  } catch (err) {
    res.status(500).json(err as Error);
  }
});

router.post("/addPaymentId", validate(pidSchema), async (req, res) => {
  const { id } = req.body;
  try {
    const prevData = await prisma.user.findFirst({ where: { id } });
    if (prevData) {
      if (prevData.paymentIds.length! < 5) {
        const paymentId = nanoid(7);
        try {
          res
            .status(200)
            .json(
              await prisma.user.update({
                where: { id },
                data: { paymentIds: { push: paymentId } },
              })
            )
            .end();
          return;
        } catch (err) {
          res.status(500).json("SOMETHING WENT WRONG");
          return;
        }
      }
      res.status(400).json("CANNOT HAVE MORE THAN 5 PAYMENTIDS");
      return;
    }
    res.status(404).json("NO USER");
    return;
  } catch (err) {
    res.status(500).json(err as any);
    return;
  }
});

router.post("/removePaymentId", validate(dpidSchema), async (req, res) => {
  const { id, paymentId } = req.body;
  const prevData = await prisma.user.findFirst({ where: { id } });
  if (prevData) {
    if (prevData.paymentIds.length! > 1) {
      const user = await prisma.user.update({
        where: { id },
        data: {
          paymentIds: prevData.paymentIds.filter((id) => paymentId !== id),
        },
      });
      res.status(200).json(user).end();
      return;
    }
    res.status(400).json("MUST HAVE AT LEAST ONE PAYMENTID");
    return;
  }
  res.status(404).json("NO USER");
  return;
});

export default router;
