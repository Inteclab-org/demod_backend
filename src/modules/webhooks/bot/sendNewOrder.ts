import axios from "axios";
import { Request, Response } from "express";
import moment from "moment-timezone";
import path from "path";
import { config } from 'dotenv'
import { OrderItem } from "../types";
import ErrorResponse from "../../shared/utils/errorResponse";
config({ path: path.join('..', '..', '.env') });


export const timberSendOrderToChat = async (req: Request, res: Response) => {
  try {
    const token: string = process.env.TIMBER_TELEGRAM_BOT_TOKEN as string;
    const chatId: string = process.env.TIMBER_TELEGRAM_ORDERS_CHAT_ID as string;
    const siteUrl: string = process.env.TIMBER_SITE_URL as string;
    const messageParseMode: 'HTML' | 'MarkdownV2' = 'HTML';
    const api = (method: string): string => `${process.env.TELEGRAM_API_URL}/bot${token}/${method}`;
    const body = req.body;

    if (body && body.order) {
      const order = body.order;

      if (!order) throw new ErrorResponse(400, "Invalid data");

      const orderItemText = (item: OrderItem, index: number) => `
    ${index + 1}. ${item.name}
         🔢 Количество: ${item.quantity || 1}
         🔗 ${siteUrl}/products/${item.slug}\n
      `;

      const message = `
🛒 Новый заказ!\n
📦 Номер заказа: ${order.id}\n
👤 Заказчик: ${order.customerFullName}
☎ Номер телефона: ${order.customerPhoneNumber}\n
📋 Товары:\n${order.items.map((item, i) => orderItemText(item, i)).join('')}\n
📝 История обновлений:
      `;

      await axios.post(api('sendMessage'),
        {
          chat_id: chatId,
          text: message,
          parse_mode: messageParseMode,
          protect_content: true,
          link_preview_options: { is_disabled: true },
          reply_markup: {
            inline_keyboard: [
              [
                {
                  "text": "⏳ В ожидании",
                  "callback_data": `update_order_status?status=pending`
                },
                {
                  "text": "📵 Нет ответа",
                  "callback_data": `update_order_status?status=no_answer`
                },
              ],
              [
                {
                  "text": "❌ Отменено",
                  "callback_data": `update_order_status?status=cancelled`
                },
                {
                  "text": "✅ Подтвержден",
                  "callback_data": `update_order_status?status=confirmed`
                }
              ]
            ]
          }
        }
      )
    }

    res.status(200).send("Order has been sent");
  } catch (error) {
    console.error("Error:", error);
    throw new ErrorResponse(500, "Server error");
  }
};
