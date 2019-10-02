import React from "react";

// 3rd party Components
import Skeleton from "react-loading-skeleton";

// 3rd party libs
import rndWord from "random-noun-generator-german";
import wiktionary from "wiktionary";
import htmlToJson from "html-to-json";

class Worter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      article: "",
      word: "",
      syllable: "",
      definition: "",
      phonetic: "",
      search: "",
      loading: true
    };
  }

  getRandomWord = () => {
    const randomWord = rndWord();

    return randomWord;
  };

  shuffleWord = () => {
    this.getDef(this.getRandomWord(), true);
  };

  handleChange = e => {
    this.setState({ search: e.target.value });
  };

  keyPress = e => {
    if (e.keyCode === 13) {
      console.log("search", e.target.value);
      this.getDef(e.target.value, false);
    }
  };

  // getWordDefinition
  getDef = (word, rnd) => {
    wiktionary(word, "de")
      .then(result => {
        this.setState({
          article: "",
          word: "",
          phonetic: "",
          syllable: "",
          definition: "",
          search: ""
        });

        if (result === null && !rnd) {
          this.setState({
            article: "Es tut mir leid",
            definition: "Ich kenne dieses Wort noch nicht."
          });
        } else if (result === null && rnd) {
          this.getDef(this.getRandomWord(), true);
        } else {
          htmlToJson.parse(
            result.html,
            {
              word: word,
              gender: function($doc) {
                const substantiv = $doc
                  .find("em")
                  .text()
                  .charAt(0);

                switch (substantiv) {
                  case "m":
                    return "Der";
                  case "f":
                    return "Die";
                  case "n":
                    return "Das";
                  default:
                    break;
                }
              },
              syllable: function($doc) {
                return $doc
                  .find("dd")
                  .first()
                  .text();
              },
              phonetic: function($doc) {
                return $doc
                  .find("dd")
                  .eq(1)
                  .text()
                  .split(" ")[1];
              },
              definition: function($doc) {
                return $doc
                  .find("dl")
                  .eq(2)
                  .text();
              }
            },
            (err, result) => {
              this.setState({
                word: result.word,
                article: result.gender,
                syllable: result.syllable,
                phonetic: result.phonetic,
                definition: result.definition,
                loading: false
              });
            }
          );
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.getDef(this.getRandomWord(), true);
  }

  render() {
    return (
      <div className="container px-5 mx-auto w-fullmb-15">
        <div className="w-full py-5 mx-auto">
          <input
            className="shadow rounded overflow-hidden shadow-lg appearance-none border  rounded w-full text-gray-700 text-xl font-medium text-orange-600 py-5 px-4 leading-tight focus:outline-none focus:bg-white focus:border-orange-600"
            id="search"
            autoFocus
            autoComplete="off"
            type="search"
            inputmode="search"
            value={this.state.search}
            onChange={this.handleChange}
            onKeyDown={this.keyPress}
            placeholder="Suche"
          ></input>
        </div>
        <div className="flex justify-between items-center mt-10 ">
          <div className="font-bold sm:text-xl md:text-2xl lg:text-4xl xl:text-6xl text-orange-600">
            {this.state.phonetic}
          </div>
          <div className="font-bold text-md lg:text-xl text-blue-500 float-right">
            {"  "}
            <button
              onClick={this.shuffleWord}
              className="py-3 px-3 rounded-full shadow bg-orange-600 focus:bg-orange-900 outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M17,17h-1.559l-9.7-10.673C5.552,6.119,5.283,6,5.001,6H2v2h2.559l4.09,4.5l-4.09,4.501H2v2h3.001 c0.282,0,0.551-0.119,0.74-0.327L10,13.987l4.259,4.686C14.448,18.881,14.717,19,14.999,19H17v3l5-4l-5-4V17z"
                />
                <path
                  fill="#fff"
                  d="M15.441,8H17v3l5-3.938L17,3v3h-2.001c-0.282,0-0.551,0.119-0.74,0.327l-3.368,3.707l1.48,1.346L15.441,8z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="defined-word font-normal text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl mb-2 flex items-center justify-between">
          <div className="flex-grow">
            <span className="font-light italic mb-2 text-red-800">
              {this.state.article}
            </span>{" "}
            <span className="word">
              {this.state.loading ? <Skeleton /> : this.state.word}
            </span>
          </div>
          <div>
            <span className="syllable-word flex-shrink font-light text-sm italic mb-2 text-orange-600 hidden lg:block">
              {this.state.loading ? <Skeleton /> : this.state.syllable}
            </span>
          </div>
          <div></div>
        </div>
        <p className="definition text-orange-600 text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl pb-5 ">
          {this.state.loading ? <Skeleton count={3} /> : this.state.definition}
        </p>
        <div className="font-normal italic text-sm text-gray-800 hover:text-orange-700">
          {this.state.loading ? (
            <Skeleton />
          ) : (
            <a
              href={`https://de.wiktionary.org/wiki/${this.state.word}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lesen Sie auf Wiktionary
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default Worter;
