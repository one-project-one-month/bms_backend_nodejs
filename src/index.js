import app from "./app.js";
import { PORT, HOST } from "./env.js";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
