class Firebase_Messaging {
    // firebaseCloudMessaging server token
    constructor() {
        this.fcmServerToken =
            'AAAAWZMjVYE:APA91bEHs6pwLgA-v51su2z1yqzUMh6YqoEk9GFj_LPHMzw7uznc2R0ywFQxESqSb6M1An9ZzfGXrZczkJw0LhwI5AOKdpKwuHVQZpIKe3d78qjR7gPzots5w6XT6EvU1sfkO0tOeoiO';
    }

    sendMsg(mTitle, mBody, receiver) {
        $.ajax({
            type: 'POST',
            url: "https://fcm.googleapis.com/fcm/send",
            headers: {
                Authorization: 'key=' + this.fcmServerToken
            },
            contentType: 'application/json',
            dataType: 'json',
            priority: 'high',
            data: JSON.stringify({ "to": receiver, "notification": { "title": mTitle, "body": mBody } }),
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.log(xhr.error);
            }
        });
    }
}