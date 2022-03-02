import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity,
  StyleSheet, Image, Dimensions,
  ScrollView,
  Platform,
} from 'react-native'
// @ts-ignore
import FadeInView from 'react-native-fade-in-view'
import * as Config from './Config'
import { Pagination } from 'react-native-snap-carousel'
import * as Utils from './apputils'
import PagerView from 'react-native-pager-view';

import { IPost, IImageCandidate } from './interfaces'

const { getAvatar, getUsername, getPostCandidate } = Utils
const deviceWidth = Dimensions.get("window").width

interface Props {
  post: IPost,
  onUsernamePress?: Function,
  onPhotoPress?: Function,
}

interface State {
  carouselIndex: number,
}

export default class PostItem extends Component<Props, State> {
  state = {
    carouselIndex: 0,
  }
  render() {
    // if (this.props.post.user.username !== "senaorucu") {
    //   return null
    // } else {
    //   console.log('this.props.post:', this.props.post)
    // }
    return (
      <FadeInView duration={300}>
        <View style={styles.container}>
          {this.renderTitle()}
          {this.renderMedia()}
          {this.renderDetail()}
        </View>
      </FadeInView>
    )
  }
  renderTitle = () => {
    const { post, onPhotoPress, onUsernamePress } = this.props
    return (
      <View style={styles.titleContainer}>
        <View style={styles.usernameContainer}>
          <TouchableOpacity
            hitSlop={{ top: 6, right: 0, bottom: 6, left: 6 }}
            onPress={() => onPhotoPress && onPhotoPress(post.user.profile_pic_url)}
          >
            <Image
              style={styles.usernameAvatar}
              source={{ uri: getAvatar(post.user && post.user.profile_pic_url) }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center', alignItems: 'center',
            }}
            hitSlop={{ top: 8, right: 8, bottom: 4, left: 0 }}
            onPress={() => onUsernamePress && onUsernamePress()}
          >
            <Text
              style={styles.usernameText}
              numberOfLines={1}
            >{post.user && getUsername(post.user.username)}</Text>
          </TouchableOpacity>
        </View>
        <Text> ... </Text>
      </View>
    )
  }
  renderImage = (candidate: IImageCandidate) => {
    // console.log('candidate:', candidate)
    const candidateToUse = getPostCandidate(candidate)
    return (
      <Image
        key={candidateToUse.url}
        resizeMode={Config.ssMode ? "cover" : "contain"}
        style={[styles.media, {
          height: (candidateToUse.height / candidateToUse.width) * deviceWidth,
        }]}
        source={{ uri: candidateToUse.url }}
      />
    )
  }
  renderMedia = () => {
    const { post } = this.props
    if (post.carousel_media_count && post.carousel_media_count > 0) {
      return this.renderCarouselImages()
    }
    if (!post.image_versions2) {
      return null
    }
    const candidate = post.image_versions2.candidates[0]
    return this.renderImage(candidate)
  }
  renderCarouselImages = () => {
    const { carouselIndex } = this.state
    const { post } = this.props
    // console.log('post:', post)
    const { carousel_media_count, carousel_media } = post

    const candidates = carousel_media.map(carouselItem => {
      const candidate = carouselItem.image_versions2.candidates[0]
      return candidate
    })

    const onPageSelect = ((e: any) => {
      this.setState({ carouselIndex: e.nativeEvent.position })
    })
    let androidHeight = 0
    if (Platform.OS === 'android') {
      candidates.forEach(candidate => {
        const cHeight = (candidate.height / candidate.width) * deviceWidth
        if (cHeight > androidHeight) {
          androidHeight = cHeight
        }
      })
    }

    const carousel = Platform.select({
      ios: (
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            try {
              const x = e.nativeEvent.contentOffset.x
              const width = e.nativeEvent.layoutMeasurement.width
              const newIndex = x / width
              this.setState({ carouselIndex: newIndex })
            } catch (error) {
              this.setState({ carouselIndex: 0 })
            }
          }}
        >
          {candidates.map(this.renderImage)}
        </ScrollView>
      ),
      android: (
        <PagerView
          style={{
            height: androidHeight,
            width: Dimensions.get('window').width,
          }}
          //@ts-ignore
          onPageSelected={onPageSelect}
          initialPage={0}>
          {candidates.map(this.renderImage)}
        </PagerView >
      )
    })

    return (
      <View>
        {carousel}
        <Pagination
          dotsLength={carousel_media_count}
          activeDotIndex={carouselIndex}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            // backgroundColor: 'white'
          }}
          inactiveDotStyle={{
            // backgroundColor: 'white',
          }}
          activeOpacity={0.8}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    )

  }
  renderDetail = () => {
    const { post } = this.props
    const { caption } = post
    if (Config.ssMode) return null
    return (
      <View style={styles.detailContainer}>
        <Text
          style={styles.descriptionText}
          numberOfLines={10}
        >{caption && caption.text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleContainer: {
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
  usernameText: {
    // color: "white",
    fontFamily: Config.fontName,
    fontWeight: 'bold',
  },
  descriptionText: {
    flex: 1,
    // color: "white",
    fontFamily: Config.fontName,
  },
  usernameAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  media: {
    width: deviceWidth,
    // backgroundColor: Config.colors.mainBackground,
  },
  detailContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
})