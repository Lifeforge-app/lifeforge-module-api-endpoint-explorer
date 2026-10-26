export interface Contract {
  list: EndpointList;
}
export interface EndpointList {
  method: "get";
  input: {};
  output: {
    OK: EndpointList_OutputOK;
  };
  media: null;
}
export interface EndpointList_OutputOK {
  [k: string]: {
    displayName: string;
    icon: string;
    category: string;
    routes: {
      method: string;
      path: string;
      description: string;
      noAuth: boolean;
      encrypted: boolean;
      isDownloadable: boolean;
      media: {
        [k: string]: {
          optional: boolean;
          multiple?: boolean;
        };
      } | null;
      input: {
        query?: {
          [k: string]: unknown;
        };
        body?: {
          [k: string]: unknown;
        };
      };
      output:
        | "custom"
        | {
            [k: string]: unknown;
          };
    }[];
  };
}
