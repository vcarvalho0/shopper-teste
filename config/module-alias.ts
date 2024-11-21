import { join } from "path";
import moduleAlias from "module-alias";

moduleAlias.addAlias("@src", join(__dirname, ".."));
