module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, ref } = req.body;

  if (!email || !ref) {
    return res.status(400).json({ error: "Missing email or ref" });
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plan: process.env.PAYSTACK_PLAN_CODE,
          reference: ref,
          callback_url: `${process.env.APP_URL}/app?upgraded=true`,
        }),
      },
    );

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ error: data.message });
    }

    return res.status(200).json({ url: data.data.authorization_url });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
