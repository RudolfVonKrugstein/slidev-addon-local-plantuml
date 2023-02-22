import { encode } from "plantuml-encoder";
import axios from "axios";
import { Md5 } from "ts-md5";

export default async function (args: any) {
  return {
    name: "replace-and-create-plantuml",
    transformSlide: async (md: string, frontmatter: any): Promise<string> => {
      const diagrams: {
        code: string;
        options: { scale?: number };
        md5sum: string;
      }[] = [];
      // Replace the markdown content
      md = md.replace(
        /^```plantuml\s*?({.*?})?\n([\s\S]+?)\n```/gm,
        (full, options = "", content = "") => {
          const code = encode(content.trim());
          const md5 = new Md5();
          md5.appendStr(content);
          const md5sum = md5.end() as string;
          options = options.trim() || "{}";
          diagrams.push({
            code,
            options,
            md5sum,
          });
          return md5sum;
        }
      );
      // Download the files
      for (let diagram of diagrams) {
        const response = await axios.get(
          `https://www.plantuml.com/plantuml/svg/${diagram.code}`,
          { responseType: "text" }
        );
        md = md.replace(
          diagram.md5sum,
          `<LocalPlantUML :svg="'${btoa(response.data)}'" v-bind="${
            diagram.options
          }"/>`
        );
        console.log(md);
      }
      return Promise.resolve(md);
    },
  };
}
