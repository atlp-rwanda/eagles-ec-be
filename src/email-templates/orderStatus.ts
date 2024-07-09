export const orderStatusTemplate = (username: string, orderId: number, createdAt: Date, status: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f8f9fa;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          width: 80%;
          max-width: 400px;
          margin: auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }
        .title {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content {
          color: #666666;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .status {
          color: black;
        }
        .footer {
          font-style: italic;
          color: #999999;
        }
        .status{
          font-weigth: 800;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="title">Order Status Updated 😍</h1>
        <p class="content">Dear ${username}, Your product status with this order id #${orderId} has been successfully to <span class="status"> ${status}</span> .</p>
        <div class="status">Status updated at ${createdAt}</div> <br />
        <div class="footer">I hope you liked our services.</div>
      </div>
    </body>
    </html>
  `;
};
