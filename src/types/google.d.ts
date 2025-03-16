declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClient {
        callback: (response: { error?: string }) => void;
        requestAccessToken(): void;
      }
      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: { error?: string }) => void;
      }): TokenClient;
    }
  }

  namespace client {
    namespace calendar {
      namespace events {
        function list(params: {
          calendarId: string;
          timeMin?: string;
          timeMax?: string;
          showDeleted?: boolean;
          singleEvents?: boolean;
          maxResults?: number;
          orderBy?: string;
        }): Promise<{ result: { items: any[] } }>;

        function insert(params: {
          calendarId: string;
          resource: any;
        }): Promise<{ result: any }>;

        function patch(params: {
          calendarId: string;
          eventId: string;
          resource: any;
        }): Promise<{ result: any }>;

        function delete(params: {
          calendarId: string;
          eventId: string;
        }): Promise<void>;
      }
    }

    function init(params: {
      apiKey: string;
      discoveryDocs: string[];
    }): Promise<void>;
  }

  namespace gapi {
    function load(
      api: string,
      callback: {
        callback: () => void;
        onerror: (error: Error) => void;
      }
    ): void;
  }
}

interface Window {
  gapi: {
    load: (api: string, callback: { callback: () => void; onerror: (error: Error) => void }) => void;
    client: {
      init: (config: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
      calendar: {
        events: {
          list: (params: any) => Promise<{ result: { items: any[] } }>;
          insert: (params: any) => Promise<{ result: any }>;
          patch: (params: any) => Promise<{ result: any }>;
          delete: (params: any) => Promise<void>;
        };
      };
    };
  };
  google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: { error?: string }) => void;
        }) => {
          callback: (response: { error?: string }) => void;
          requestAccessToken: () => void;
        };
      };
    };
  };
} 