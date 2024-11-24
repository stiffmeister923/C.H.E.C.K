export type FileData = {
  status: string;
  data: {
    [imageName: string]: ImageDetails;
  };
  uid: string;
};

type ImageDetails = {
  original_image: string;
  name_section_url: string;
  answer_section_url: string;
  error: string | null;
};
