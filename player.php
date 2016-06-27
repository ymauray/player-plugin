<?php
/**
 * Plugin Name: Player
 * Plugin URI: http://github.com/yannick.mauray/player-plugin
 * Description: A player plugin for PowerPress
 * Version: 0.0.1
 * Author: Yannick Mauray
 * Author URI: http://frenchguy.ch/
 * Requires at least: 4.5
 * Tested up to: 4.5.2
 * Text Domain: player
 * License: GPL (http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
 */

define( 'PLAYER_MAIN_FILE', __FILE__ );

add_filter( 'powerpress_player', function ( $content, $media_url, $EpisodeData = array() ) {
	global $post;
	global $wp_filter;

	// Remove original filter
	remove_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10 );

	if( empty($post->ID) || !is_object($post) ) {
		add_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10, 3 );
		return $content;
	}

	$cue_sheet = get_post_meta( $post->ID, 'cuesheet', TRUE );

	if (empty( $cue_sheet )) {
		add_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10, 3 );
		return $content;
	}

	$extension = powerpressplayer_get_extension($media_url);
	switch( $extension ) {
		case 'mp3':
		case 'ogg':
			$content .= build_player_player($media_url, $EpisodeData);
		break;
		default:
			add_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10, 3 );
	}
	return $content;
}, 3, 3 );

/**
 * @param $media_url
 * @param array $EpisodeData
 * @return string
 */
function build_player_player($media_url, $EpisodeData = array() ) {

}