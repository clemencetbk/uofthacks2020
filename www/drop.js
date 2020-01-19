export default function attachDropListener(dropTarget, callback) {
  dropTarget.addEventListener('filedrop', (event) => {
    event.preventDefault();
    Promise.all(event.files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => resolve({ name: file.name, body: event.target.result}));
      reader.addEventListener('error', reject);
      reader.addEventListener('abort', reject);
      reader.readAsText(file);
    }))).then((files) => {
      const messages = files.find((file) => file.name === 'message_1.json')
      const locationHistory1 = files.find((file) => file.name === 'Location History 1.json')
      const locationHistory2 = files.find((file) => file.name === 'Location History 2.json')
      if (messages != null && locationHistory1 != null && locationHistory2 != null) {
        callback(JSON.parse(messages.body), JSON.parse(locationHistory1.body), JSON.parse(locationHistory2.body));
      }
    })
  });
}
