import * as React from 'react';
//import styles from './FsposOpinion.module.scss';
import type { IFsposOpinionProps } from './IFsposOpinionProps';
import { Logger, LogLevel } from "@pnp/logging";
import { Caching } from "@pnp/queryable";
import { SPFI, spfi } from "@pnp/sp";
import { getSP } from './pnpjsconfig';
//import dayjs from 'dayjs';
import { IOpinionState, IOpinionItem, IResponseItem } from './interfaces';
import dayjs from 'dayjs';


export default class FsposOpinion extends React.Component<IFsposOpinionProps, IOpinionState> {

  private LOG_SOURCE = "🅿PnPjsExample";
  private _sp: SPFI;  

  constructor(props:IFsposOpinionProps){
    super(props);

    this.state = {
      items:[]
    }
    this._sp = getSP();
  }

  public render(): React.ReactElement<IFsposOpinionProps> {
    
    const {
    } = this.props;


    // Taylor do your magic here :) Render this.state.items
    return(
      <section>
       <div>
          {this.state.items.map((item, idx) => {
            const shortTime = dayjs(item.Created).format("HH:mm");
              return (<article>
                        <p>{shortTime}</p>
                        <h1>{item.Title}</h1>
                        <p>{item.Author0}</p>
                        <img src={item.ImageUrl} />                                              
                        <p>{item.Content}</p>
                      </article>
                    );
                  })}
        </div>     
      </section>
    );
  }

  private _readAllListItems = async(): Promise<void> => {
    try{
      const spCache = spfi(this._sp).using(Caching({store:"session"}));

      const response: IOpinionItem[] = await spCache.web.lists
        .getByTitle(this.props.listName)
        .items
        .select("Id", "Title", "Content", "Author0", "Created", "ImageUrl")
        .orderBy("Created", false)();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IOpinionItem[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id,
          Title: item.Title,
          Content: item.Content,
		      Author0: item.Author0,
          Created: item.Created,
          ImageUrl: item.ImageUrl
        };
      });
      this.setState({items});
      console.log("items: " +items);
    }
    catch(err){
      Logger.write(`${this.LOG_SOURCE} (_readAllKwitterItems) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  componentDidMount(): void {
    this._readAllListItems();
  }
}
