<template>
  <div>
    <UiNavbar sticky>
      <UiContainer class="flex h-14 items-center justify-between">
        <p class="font-semibold">Nuxt PDFMake</p>
        <UiButton size="icon-sm" variant="ghost" @click="toggleMode">
          <icon class="size-5" name="lucide:sun-medium" />
        </UiButton>
      </UiContainer>
    </UiNavbar>
    <UiContainer class="py-5">
      <div>
        <p class="text-lg font-medium">Open in new window</p>
        <p class="mb-4 mt-1 text-muted-foreground">
          Click the button below to open the pdf table in a new window
        </p>
        <UiButton size="sm" variant="outline" text="Print table" @click="exportData" />
        <UiDivider class="my-6" />
      </div>
      <div>
        <p class="text-lg font-medium">Column example</p>
        <p class="mb-4 mt-1 text-muted-foreground">
          Here we use the composable to export a column example. The font was also updated
        </p>
        <UiButton size="sm" variant="outline" text="Print article" @click="exportComposable" />
      </div>
    </UiContainer>
  </div>
</template>

<script setup lang="ts">
  import { _colors } from "#tailwind-config/theme";

  useHead({ title: "Nuxt PDF Make Playground" });
  const colorMode = useColorMode();
  const toggleMode = () => {
    colorMode.preference = colorMode.value === "light" ? "dark" : "light";
  };

  const { $pdfMake } = useNuxtApp();

  const exportComposable = () => {
    const pdfMake = usePDFMake();

    pdfMake
      .createPdf(
        {
          content: [
            "By default paragraphs are stacked one on top of (or actually - below) another. ",
            "It's possible however to split any paragraph (or even the whole document) into columns.\n\n",
            "Here we go with 2 star-sized columns, with justified text and gap set to 20:\n\n",
            {
              alignment: "justify",
              columns: [
                {
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
                {
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
              ],
            },
            "\nStar-sized columns have always equal widths, so if we define 3 of those, it'll look like this (make sure to scroll to the next page, as we have a couple of more examples):\n\n",
            {
              columns: [
                {
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
                {
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
                {
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
              ],
            },
            "\nYou can also specify accurate widths for some (or all columns). Let's make the first column and the last one narrow and let the layout engine divide remaining space equally between other star-columns:\n\n",
            {
              columns: [
                {
                  width: 90,
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
                {
                  width: "*",
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
                {
                  width: "*",
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
                {
                  width: 90,
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                },
              ],
            },
            "\nWe also support auto columns. They set their widths based on the content:\n\n",
            {
              columns: [
                {
                  width: "auto",
                  text: "auto column",
                },
                {
                  width: "*",
                  text: "This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.",
                },
                {
                  width: 50,
                  text: "this one has specific width set to 50",
                },
                {
                  width: "auto",
                  text: "another auto column",
                },
                {
                  width: "*",
                  text: "This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.",
                },
              ],
            },
            "\nIf all auto columns fit within available width, the table does not occupy whole space:\n\n",
            {
              columns: [
                {
                  width: "auto",
                  text: "val1",
                },
                {
                  width: "auto",
                  text: "val2",
                },
                {
                  width: "auto",
                  text: "value3",
                },
                {
                  width: "auto",
                  text: "value 4",
                },
              ],
            },
            "\nAnother cool feature of pdfmake is the ability to have nested elements. Each column is actually quite similar to the whole document, so we can have inner paragraphs and further divisions, like in the following example:\n\n",
            {
              columns: [
                {
                  width: 100,
                  fontSize: 9,
                  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Conveniunt quieti extremum severitatem disseretur virtute locum virtus declarant. Greges telos detrimenti persius possint eripuit appellat democrito suscipere existimant. Facere usus levitatibus confirmavit, provincia rutilius libris accommodare valetudinis ignota fugienda arbitramur falsarum commodius. Voluptas summis arbitrarer cognitio temperantiamque, fuit posidonium pro assueverit animos inferiorem, affecti honestum ferreum cum tot nemo ius partes dissensio opinor, tuum intellegunt numeris ignorant, odia diligenter licet, sublatum repellere, maior ficta severa quantum mortem. Aut evertitur impediri vivamus.",
                },
                [
                  "As you can see in the document definition - this column is not defined with an object, but an array, which means it's treated as an array of paragraphs rendered one below another.",
                  "Just like on the top-level of the document. Let's try to divide the remaing space into 3 star-sized columns:\n\n",
                  {
                    columns: [
                      {
                        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                      },
                      {
                        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                      },
                      {
                        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.",
                      },
                    ],
                  },
                ],
              ],
            },
            "\n\nOh, don't forget, we can use everything from styling examples (named styles, custom overrides) here as well.\n\n",
            "For instance - our next paragraph will use the 'bigger' style (with fontSize set to 15 and italics - true). We'll split it into three columns and make sure they inherit the style:\n\n",
            {
              style: "bigger",
              columns: [
                "First column (BTW - it's defined as a single string value. pdfmake will turn it into appropriate structure automatically and make sure it inherits the styles",
                {
                  fontSize: 20,
                  text: "In this column, we've overriden fontSize to 20. It means the content should have italics=true (inherited from the style) and be a little bit bigger",
                },
                {
                  style: "header",
                  text: "Last column does not override any styling properties, but applies a new style (header) to itself. Eventually - texts here have italics=true (from bigger) and derive fontSize from the style. OK, but which one? Both styles define it. As we already know from our styling examples, multiple styles can be applied to the element and their order is important. Because 'header' style has been set after 'bigger' its fontSize takes precedence over the fontSize from 'bigger'. This is how it works. You will find more examples in the unit tests.",
                },
              ],
            },
            "\n\nWow, you've read the whole document! Congratulations :D",
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
            },
            bigger: {
              fontSize: 15,
              italics: true,
            },
          },
          defaultStyle: {
            columnGap: 20,
            font: "Poppins",
            color: _colors.slate[800],
          },
        },
        {},
        useFontPresets()
      )
      .open();
  };

  const exportData = () => {
    $pdfMake.tableLayouts = {
      custom: {
        fillColor: function (rowIndex) {
          return rowIndex % 2 !== 0 ? _colors.slate[50] : null;
        },
        hLineColor: _colors.slate[200],
        vLineColor: _colors.slate[200],
        paddingLeft: function () {
          return 10;
        },
        paddingRight: function () {
          return 10;
        },
      },
    };

    $pdfMake
      .createPdf({
        content: [
          {
            layout: "custom",
            table: {
              heights: 20,
              widths: "*",
              body: [
                ["Id", "Name", "Phone", "Email"],
                ["1", "John Doe", "1234567890", "johndoe@test.com"],
                ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
                ["1", "John Doe", "1234567890", "johndoe@test.com"],
                ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
                ["1", "John Doe", "1234567890", "johndoe@test.com"],
                ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
                ["1", "John Doe", "1234567890", "johndoe@test.com"],
                ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
                ["1", "John Doe", "1234567890", "johndoe@test.com"],
                ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
                ["1", "John Doe", "1234567890", "johndoe@test.com"],
                ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
              ],
            },
          },
        ],
      })
      .open();
  };
</script>
