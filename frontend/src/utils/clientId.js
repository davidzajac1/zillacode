const CLIENT_ID_KEY = "client_id";

export function getClientId() {
  let clientId = window.localStorage.getItem(CLIENT_ID_KEY);

  if (!clientId) {
    clientId = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_KEY, clientId);
  }

  return clientId;
}
