"use strict";

import NotificationModel from "../models/notifications.model";

class NotificationService {
  static async pushNotiToSystem({
    type = "SHOP_001",
    receivedId = 1,
    senderId = "",
    options = {},
  }) {
    let content = "";
    if (type === "SHOP_001") {
      content = `User ${senderId} has just added new product : @@@`;
    } else if (type === "PROMOTION_1") {
      content = `Shop @@@ has just created new promotion : @@@`;
    }

    const newNoti = await NotificationModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_content: content,
      noti_options: options,
    });
    return newNoti;
  }

  static async getListNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
    const match: {
      noti_receivedId: Number;
      notiType?: String;
    } = {
      noti_receivedId: userId,
    };
    if (type !== "ALL") {
      match.notiType = type;
    }

    return await NotificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_content: 1,
          noti_senderId: 1,
          createdAt: 1,
          noti_options: 1,
        },
      },
    ]);
  }
}

export default NotificationService;
