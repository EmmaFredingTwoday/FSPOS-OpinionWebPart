export interface IOpinionState {
    items: IOpinionItem[];
}

// create item to work with it internally
export interface IOpinionItem {
    Id: number;
    Title: string;
    Content: string;
    Author0: string;
    Created: Date;
    ImageUrl: string;
  }

  // create File item to work with it internally with images
    export interface IImageFile{
    Id: number;
    LinkJson: JSON;
    }
   
  // create PnP JS response interface for Item
  export interface IResponseItem {
    Id: number;
    Title: string;
    Content: string;    
    Author0: string;
    Created: Date;
    ImageUrl: string;
  }
