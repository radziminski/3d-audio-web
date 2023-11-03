import { NextApiRequest, NextApiResponse } from 'next';

type ResponseDto = {
  message: string;
};

const healthCheckHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDto>
) => {
  const data: ResponseDto = {
    message: 'Api working properly ✅',
  };

  res.status(200).json(data);
};

export default healthCheckHandler;
