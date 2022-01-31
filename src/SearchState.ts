import { computed, observable, action, reaction } from 'mobx'


class SearchState {

  @observable _searchResults = []

  @computed get searchResults() {
    console.warn(this._searchResults.slice())
    return this._searchResults.slice()
  }

  @action searchUser = async (searchKey) => {
    const url = `https://www.instagram.com/web/search/topsearch/?context0blended&query=${encodeURIComponent(searchKey)}`
    const res = await fetch(url)
    const data = await res.json()
    console.warn('response', data.users)
    this._searchResults = data.users
  }
}

export default SearchState