export default function attachDropListener(dropTarget, callback) {
  dropTarget.addEventListener('filedrop', (event) => {
    event.preventDefault();
    const files = event.files.filter((file) => ['message_1.json', 'Location History.json'].includes(file.name))
    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => resolve({ name: file.name, body: event.target.result}));
      reader.addEventListener('error', reject);
      reader.addEventListener('abort', reject);
      reader.readAsText(file);
    }))).then((files) => {
      const messages = files.find((file) => file.name === 'message_1.json')
      const locationHistory = files.find((file) => file.name === 'Location History.json')
      if (messages != null && locationHistory != null) {
        callback(JSON.parse(messages.body), JSON.parse(locationHistory.body));
      }
    })
  });
}