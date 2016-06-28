<?php
/**
 * Plugin Name: Yannick's Player
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

	if ( empty( $post->ID ) || ! is_object( $post ) ) {
		add_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10, 3 );

		return $content;
	}

	$cue_sheet = get_post_meta( $post->ID, 'cuesheet', true );

	if ( empty( $cue_sheet ) ) {
		add_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10, 3 );

		return $content;
	}

	$extension = powerpressplayer_get_extension( $media_url );
	switch ( $extension ) {
		case 'mp3':
		case 'ogg':
			$content .= build_player_player( $media_url, $cue_sheet, $EpisodeData );
			break;
		default:
			add_filter( 'powerpress_player', 'powerpressplayer_player_audio', 10, 3 );
	}

	return $content;
}, 2, 3 );

add_action( 'init', function () {
	wp_enqueue_script( 'yma-player', plugin_dir_url( PLAYER_MAIN_FILE ) . 'yma-player.js', array( 'jquery' ) );
	wp_enqueue_style( 'yma-player', plugin_dir_url( PLAYER_MAIN_FILE ) . 'yma-player.css' );
	wp_enqueue_style( 'fontawesome', plugin_dir_url( PLAYER_MAIN_FILE ) . 'font-awesome-4.6.3/css/font-awesome.min.css' );
} );

/**
 * @param $media_url
 * @param array $EpisodeData
 *
 * @return string
 */
function build_player_player( $media_url, $cue_sheet, $EpisodeData = array() ) {
	global $post;
	$player_id = powerpressplayer_get_next_id();
	$cue_lines = preg_split("/\n/", $cue_sheet . '\r\n');
	$intag = FALSE;
	$options = '';
	$title = '';
	$performer = '';
	$index = '';
	$timestamp = 0;
	foreach ($cue_lines as $cue_line) {
		$clean_line = trim( $cue_line );
		if (substr($clean_line, 0, 6) == 'TRACK ') {
			if ( $intag ) {
				$options .= "<option value='{$title}' data-performer='{$performer}' data-index='{$timestamp}'>";
			}
			$intag = TRUE;
		} else if (substr( $clean_line, 0, 6 ) == 'TITLE ') {
			$title = substr( $clean_line, 7, -1 );
		} else if (substr($clean_line, 0, 10) == 'PERFORMER ') {
			$performer = substr( $clean_line, 11, - 1 );
		} else if (substr($clean_line, 0, 9) == 'INDEX 01 ') {
			$index = substr( $clean_line, 9 );
			$numbers = explode(':', $index);
			$timestamp = ((60 * 100 * $numbers[0]) + (100 * $numbers[1]) + $numbers[2]) / 100;
		}
	}
	$options .= "<option value='{$title}' data-performer='{$performer}' data-index='{$timestamp}'>";
	$content   = <<<EOF
<div class="powerpress_player" id="powerpress_player_{$player_id}">
	<div class="yma_player" id="yma_player_{$player_id}">
		<div class="yma_player_display">
			<div class="yma_player_post_title">{$post->post_title}</div>
			<div class="yma_player_track_info single"><span class="yma_player_artist single">—</span><span class="yma_player_title"></span></div>
		</div>
		<div class="yma_player_play_button" data-player-id="{$player_id}"><i class="fa fa-play-circle"></i></div>
		<div class="yma_player_background_bar" data-player-id="{$player_id}"></div>
		<div class="yma_player_progress_bar" data-player-id="{$player_id}"></div>
		<div class="yma_player_volume_bar data-player-id="{$player_id}">
			<div class="yma_player_volume_button data-player-id="{$player_id}"></div>
		</div>
		<audio id="yma_player_audio_{$player_id}" data-player-id="{$player_id}">
			<source src="{$media_url}" type="{$EpisodeData['type']}">
		</audio>
		<datalist>{$options}</datalist>
	</div>
</div>
EOF;

	return $content;
}
