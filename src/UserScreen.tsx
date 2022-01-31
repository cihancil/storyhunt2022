import React, { Component } from 'react'
import {
  Text, View, ScrollView, Image, StyleSheet,
  TouchableOpacity, ActivityIndicator, ImageBackground,
} from 'react-native'
//@ts-ignore
import ListView from 'deprecated-react-native-listview'
//@ts-ignore
import IconFeather from 'react-native-vector-icons/Feather'
import { observer } from 'mobx-react/native'
import Toast from 'react-native-tiny-toast'

import { IUserDetailed, IUser, IPost, IStoryPerUser, IImageCandidate } from './interfaces'
import * as Config from './Config'
import { getAvatar, getUsername } from './apputils'
import PostItem from './PostItem'
import Api from './Api'
import Header from './Header'
import BackButton from './BackButton'

const ds = new ListView.DataSource({ rowHasChanged: (r1: any, r2: any) => r1 !== r2 })

interface IProps {
  navigation: any,
}

interface IState {
  userBasic: IUser,
  user?: IUserDetailed,
  posts: IPost[],
  stories: IStoryPerUser[],
  fetchingPosts: boolean,
  privateUser?: boolean,
}

@observer
export default class UserScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      userBasic: this.props.navigation.getParam('user', null),
      fetchingPosts: true,
      posts: [],
      stories: [],
    };
  };

  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      const { pk } = this.state.userBasic
      const user: IUserDetailed = await Api.getUserDetail(pk)
      // const favoritedUsers: IUser[] = FavoriteState.favUsers
      // console.log('user:', user)
      // console.log('favoritedUsers:', favoritedUsers)
      this.setState({
        user
      })
      const posts = await Api.getUserFeed(pk)
      const stories = await Api.getUserTray(pk)
      // console.log('posts:', posts)
      // console.log('stories:', stories)
      this.setState({
        posts,
        stories,
        fetchingPosts: false,
      })
    } catch (error) {
      if (error.message === "private") {
        this.setState({
          privateUser: true,
          fetchingPosts: false,
        })
      } else {
        Toast.show('Error has occured. Please try again later')
        this.props.navigation.pop()
      }
    }
  }
  render() {
    const { userBasic } = this.state
    return (
      <View style={styles.container}>
        <Header
          title={getUsername(userBasic.username)}
          leftIcon={<BackButton
            onPress={() => this.props.navigation.pop()}
          />}
        />
        {this.renderPosts()}
        {this.renderAd()}
      </View>
    )
  }

  renderInfo = () => {
    const { userBasic } = this.state
    return (
      <View style={styles.infoContainer}>
        <View style={styles.infoUpperContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.props.navigation.navigate("Photo", {
                user: userBasic,
              })
            }}
          >
            <Image
              style={styles.avatar}
              source={{ uri: getAvatar(userBasic && userBasic.profile_pic_url) }}
            />
            <View style={{
              backgroundColor: '#5851DB', position: 'absolute', right: 0, bottom: 0,
              width: 32, height: 32, borderRadius: 16,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <IconFeather name="zoom-in" color="white" size={22} />
            </View>
          </TouchableOpacity>
          <View style={styles.infoUpperLeftContainer}>
            {this.renderStatistics()}
          </View>
        </View>
        {this.renderSummary()}
        {this.renderStories()}
        {this.renderIsPrivate()}
      </View>
    )
  }

  renderStatistics = () => {
    const { user } = this.state
    return (
      <View style={styles.statisticsContainer}>
        <View style={styles.statisticContainer}>
          {
            user &&
            <Text style={styles.statisticsText}>
              {user.media_count}
            </Text>
          }
          <Text style={styles.statisticsText}>posts</Text>
        </View>
        <View style={styles.statisticContainer}>
          {
            user &&
            <Text style={styles.statisticsText}>
              {user.follower_count}
            </Text>
          }
          <Text style={styles.statisticsText}>followers</Text>
        </View>
        <View style={styles.statisticContainer}>
          {
            user &&
            <Text style={styles.statisticsText}>
              {user.following_count}
            </Text>
          }
          <Text style={styles.statisticsText}>following</Text>
        </View>
      </View>
    )
  }

  // renderFavoriteButton = () => {
  //   const { userBasic } = this.state
  //   let isFavorited = false
  //   FavoriteState.favUsers.forEach(u => {
  //     if (u.pk === userBasic.pk) {
  //       isFavorited = true
  //     }
  //   })
  //   if (isFavorited) {
  //     return (
  //       <TouchableOpacity
  //         hitSlop={{ top: 8, bottom: 8, }}
  //         onPress={this.unfavoriteUser}
  //         style={styles.favoriteButtonContainer}>
  //         <IconAntDesign name="star" color="white" size={24} />
  //         <Text style={styles.favoriteButtonText}>Remove from your favorites</Text>
  //       </TouchableOpacity>
  //     )
  //   }
  //   return (
  //     <TouchableOpacity
  //       hitSlop={{ top: 8, bottom: 8, }}
  //       onPress={this.favoriteUser}
  //       style={styles.favoriteButtonContainer}>
  //       <IconAntDesign name="staro" color="white" size={24} />
  //       <Text style={styles.favoriteButtonText}>Add to your favorites</Text>
  //     </TouchableOpacity>
  //   )
  // }

  renderSummary = () => {
    const { user } = this.state
    if (!user) return null
    if (Config.ssMode) return null
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {user.biography}
        </Text>
        <Text style={styles.summaryText}>
          {user.profile_context}
        </Text>
      </View>
    )
  }

  renderStories = () => {
    const { user, stories } = this.state
    if (!user) return null
    if (!stories || stories.length <= 0) return null
    if (user.is_private && this.state.privateUser) return null
    return (
      <ScrollView
        style={{ marginTop: 16 }}
        horizontal
      >
        {stories.map(this.renderStoryThumbnail)}
      </ScrollView>
    )
  }

  renderStoryThumbnail = (story: IStoryPerUser, index: number) => {
    const { candidates } = story.image_versions2
    let bestCandidate: IImageCandidate | undefined
    candidates.forEach(c => {
      if (c.width > 150 && c.width < 320 && c.height > 150 && c.height < 320) {
        bestCandidate = c
      }
    })
    let uri
    if (bestCandidate) {
      uri = bestCandidate.url
    }
    if (!uri) return null
    return (
      <TouchableOpacity
        key={`thumbnail_${story.pk}`}
        onPress={() => this.handleStoryPress(index)}
        style={{
          marginRight: 16,
        }}>
        <Image
          source={{ uri }}
          style={{
            width: 84, height: 84,
            borderRadius: 4,
            // backgroundColor: Config.colors.mainBackground,
          }}
        />
      </TouchableOpacity>
    )

  }

  renderIsPrivate = () => {
    const { user } = this.state
    if (!user) return null
    if (user.is_private && this.state.privateUser) {
      return (
        <Text style={styles.privateUserText}>
          Private User
        </Text>
      )
    }
  }

  _keyExtractorTimeline = (item: IPost) => item.id
  renderPosts = () => {
    const { posts } = this.state
    return (
      <ListView
        ref="scrollView"
        enableEmptySections
        dataSource={ds.cloneWithRows(posts)}
        renderRow={this.renderPost}
        renderHeader={this.renderInfo}
        // onEndReached={this.onFetchFeedMore}
        contentContainerStyle={styles.scrollContent}
        //@ts-ignore
        renderFooter={this.renderFooter}
      />
    )
  }
  renderPost = (post: IPost) => {
    return (
      <PostItem post={post} />
    )
  }
  renderFooter = () => {
    const { fetchingPosts } = this.state
    if (fetchingPosts) {
      return (
        <View style={{ height: 40, paddingBottom: 20, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator />
        </View>
      )
    }
    return null
  }

  renderAd = () => {
    if (Config.adsEnabled()) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0, left: 0,
            alignItems: "center",
          }}
        >
          {/* <Banner
            unitId={requestSearchAdUnit}
            size={"BANNER"}
            request={requestSearch.build()}
          /> */}
        </View>
      )
    }
  }

  // favoriteUser = async () => {
  //   const { userBasic } = this.state
  //   await FavoriteState.setFavoriteUser(userBasic)
  //   this.setState({})
  // }

  // unfavoriteUser = async () => {
  //   const { userBasic } = this.state
  //   await FavoriteState.removeFavoriteUser(userBasic)
  //   this.setState({})
  // }

  handleStoryPress = (index: number) => {
    this.props.navigation.navigate("Stories", {
      users: [this.state.user],
      initialIndex: 0,
      initialCarouselIndex: index,
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Config.colors.mainDark,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 64,
  },
  infoContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoUpperContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
  infoUpperLeftContainer: {
    flex: 1,
  },
  favoriteButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
  },
  favoriteButtonText: {
    // color: "white",
    fontFamily: Config.fontName,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  statisticsContainer: {
    flexDirection: "row",
    alignItems: 'center',
    flex: 1,
  },
  statisticContainer: {
    flex: 1,
    alignItems: "center",
  },
  statisticsText: {
    // color: "white",
    fontFamily: Config.fontName,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 8,
  },
  summaryText: {
    // color: "white",
    fontFamily: Config.fontName,
  },
  privateUserText: {
    // color: "white",
    fontWeight: 'bold',
    marginTop: 30,
    fontFamily: Config.fontName,
    fontSize: 18,
    alignSelf: 'center',
  },
})