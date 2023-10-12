import * as React from 'react';
import type { IFsposOpinionProps } from './IFsposOpinionProps';
import { Logger, LogLevel } from "@pnp/logging";
import { SPFI } from "@pnp/sp";
import { getSP } from './pnpjsconfig';
import { IOpinionState, IOpinionItem, IResponseItem } from './interfaces';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


export default class FsposOpinion extends React.Component<IFsposOpinionProps, IOpinionState> {

  private LOG_SOURCE = "🅿PnPjsExample";
  private _sp: SPFI;  

  constructor(props:IFsposOpinionProps) {
    super(props);

    this.state = {
      items: []
    }
    this._sp = getSP();
  }

  public render(): React.ReactElement<IFsposOpinionProps> {
    const articleStyle = {
      padding: '15px',
      borderBottom: '1px solid #e5e5e5'
    };

    const h1Style = {
      fontSize: '24px',
      margin: '10px 0'
    };

    const pStyle = {
      margin: '10px 0',
      lineHeight: '1.5'
    };

    return (
      <section style={{ fontFamily: 'Arial, sans-serif' }}>
        {this.state.items.map((item, idx) => {
          return (
            <article style={articleStyle}>
              <h1 style={h1Style}>{item.Title}</h1>
              <p style={pStyle}>{item.Author0}</p>
              <img src={item.ImageUrl} style={{ 'width' : '100%', 'maxHeight': '250px', 'objectFit' : 'cover'}} />
              <p style={pStyle}>{item.Content}</p>
              <span style={pStyle}>{dayjs(item.Created).fromNow()}</span>
            </article>
          );
        })}
      </section>
    );
  }

  private _readAllListItems = async(): Promise<void> => {
    try {
      const response: IOpinionItem[] = await this._sp.web.lists
        .getByTitle(this.props.listName)
        .items
        .select("Id", "Title", "Content", "Author0", "Created", "ImageUrl")
        .orderBy("Created", false)();

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

      this.setState({ items });
      console.log("items: " + items);
    }
    catch(err) {
      Logger.write(`${this.LOG_SOURCE} (_readAllKwitterItems) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  componentDidMount(): void {
    this._readAllListItems();
  }
}
