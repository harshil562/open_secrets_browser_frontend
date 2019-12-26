import React, { Component } from "react";

class Search extends Component {
  constructor() {
    super();
    this.state = {
      candidate_search: "",
      search_by_state: "",
      state_search_results: [],
      candidate: {
        candidate_name: "",
        candidate_id: "",
        candidate_cycle: ""
      },
      contributors: []
    };
  }

  //   componentDidMount() {
  //     fetch(
  //       "https://www.opensecrets.org/api/?method=candContrib&cid=N00004724&apikey=a192665c31c48bfd2207ff83594a15d2&output=json"
  //     )
  //       .then(resp => resp.json())
  //       .then(data => {
  //         let candidate_name =
  //           data.response.contributors["@attributes"].cand_name;
  //         let candidate_id = data.response.contributors["@attributes"].cid;
  //         let candidate_cycle = data.response.contributors["@attributes"].cycle;
  //         this.setState({
  //           candidate: {
  //             candidate_name: candidate_name,
  //             candidate_id: candidate_id,
  //             candidate_cycle: candidate_cycle
  //           }
  //         });
  //         let contributors = data.response.contributors.contributor.map(
  //           contributor => {
  //             return (
  //               <div>
  //                 <h4>Contributor name: {contributor["@attributes"].org_name}</h4>
  //                 <h4>Total donated: ${contributor["@attributes"].total}</h4>
  //                 <h4>Amount from PACs: ${contributor["@attributes"].pacs}</h4>
  //                 <h4>
  //                   Amount from individuals: ${contributor["@attributes"].indivs}
  //                 </h4>
  //                 <br></br>
  //               </div>
  //             );
  //           }
  //         );
  //         this.setState({
  //           contributors: contributors
  //         });
  //       });
  //   }

  handleCandidateChange = e => {
    this.setState({ candidate_search: e.target.value });
  };

  handleLettersChange = e => {
    this.setState({ search_by_state: e.target.value.toUpperCase() });
  };

  handleCandidateSubmit = e => {
    e.preventDefault();
    fetch(
      "https://www.opensecrets.org/api/?method=candContrib&cid=" +
        this.state.candidate_search +
        "&apikey=a192665c31c48bfd2207ff83594a15d2&output=json"
    )
      .then(resp => resp.json())
      .then(data => {
        let candidate_name =
          data.response.contributors["@attributes"].cand_name;
        let candidate_id = data.response.contributors["@attributes"].cid;
        let candidate_cycle = data.response.contributors["@attributes"].cycle;
        this.setState({
          candidate: {
            candidate_name: candidate_name,
            candidate_id: candidate_id,
            candidate_cycle: candidate_cycle
          }
        });
        let contributors = data.response.contributors.contributor.map(
          contributor => {
            return (
              <div>
                <h4>Contributor name: {contributor["@attributes"].org_name}</h4>
                <h4>Total donated: ${contributor["@attributes"].total}</h4>
                <h4>Amount from PACs: ${contributor["@attributes"].pacs}</h4>
                <h4>
                  Amount from individuals: ${contributor["@attributes"].indivs}
                </h4>
                <br></br>
              </div>
            );
          }
        );
        this.setState(
          {
            contributors: contributors
          },
          () => {
            console.log(this.state.candidate.candidate_name);
            fetch("http://localhost:4000/candidates", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                cand_name: this.state.candidate.candidate_name,
                cid: this.state.candidate.candidiate_id,
                cycle: this.state.candidate.candidate_cycle
              })
            })
              .then(resp => resp.json())
              .then(json => console.log(json));
          }
        );
      });
  };

  handleLettersSubmit = e => {
    e.preventDefault();
    fetch(
      "http://www.opensecrets.org/api/?method=getLegislators&id=" +
        this.state.search_by_state +
        "&apikey=a192665c31c48bfd2207ff83594a15d2&output=json"
    )
      .then(resp => resp.json())
      .then(data => {
        let search_results = data.response.legislator.map(legislator => {
          return (
            <div>
              <h4>Legislator name: {legislator["@attributes"].firstlast}</h4>
              <h4>ID: {legislator["@attributes"].cid}</h4>
              <br></br>
            </div>
          );
        });
        this.setState({
          state_search_results: search_results
        });
      });
    //   .catch(alert("That's not a state! Try again"));
  };

  render() {
    return (
      <div>
        <h1>Find candidate by state letters</h1>
        <form onSubmit={this.handleLettersSubmit}>
          <label>
            Enter the state's two-character code:
            <input
              type="text"
              value={this.state.search_by_state}
              onChange={this.handleLettersChange}
            ></input>
            <input type="submit" value="Search"></input>
          </label>
        </form>

        <h2>Search results by state:</h2>
        {this.state.state_search_results}

        <h1>Find financial information about a candidate</h1>
        <form onSubmit={this.handleCandidateSubmit}>
          <label>
            Candidate ID:
            <input
              type="text"
              value={this.state.candidate_search}
              onChange={this.handleCandidateChange}
            ></input>
            <input type="submit" value="Search"></input>
          </label>
        </form>

        <h1>Candidate: {this.state.candidate.candidate_name}</h1>
        <h3>Candidate ID: {this.state.candidate.candidate_id}</h3>
        <h3>Candidate Cycle: {this.state.candidate.candidate_cycle}</h3>
        <br></br>
        <h2>Top Contributors:</h2>
        {this.state.contributors}
      </div>
    );
  }
}

export default Search;