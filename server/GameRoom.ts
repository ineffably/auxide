export interface Client {
  id: string;
  name?: string;
  ping?: number;
}

export class GameRoom {
  private allClients = [] as Client[];
  
  addClient(client: Client): void {
    if(!this.allClients.includes(client)){
      this.allClients.push(client);
    }
  }
}