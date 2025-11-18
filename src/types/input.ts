export interface InputData {
  fullName?: string;
  emailAdress?: string;

  phoneNumber?: {
    home?: string;
    work?: string;
  };

  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}
