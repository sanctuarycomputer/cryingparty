import type { NextApiRequest, NextApiResponse } from 'next';
import { IgApiClient } from 'instagram-private-api';

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME || '');
if (process.env.IG_PROXY) ig.state.proxyUrl = process.env.IG_PROXY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    let handle = req.query?.handle || '';
    handle = Array.isArray(handle) ? handle[0] : handle;
    //await ig.simulate.preLoginFlow();
    const auth = await ig.account.login(
      process.env.IG_USERNAME || '',
      process.env.IG_PASSWORD || ''
    );
    const user = await ig.user.searchExact(handle);
    const info = await ig.user.info(user.pk);
    res.status(200).json(info);
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return res.status(500).json({ error: e.message || "unexpected" });
    }
    res.status(500).json({ error: "unexpected" });
  }
}
