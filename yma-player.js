(function ($) {

    'use strict';

    $(document).ready(function () {

        var audios = $('.yma_player audio');
        audios.on('play', function (event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            console.log('Playing player ', id, player);
        });

        audios.on('pause', function (event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            console.log('Paused player ', id, player);
        });

        audios.on('progress', function (event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            console.log('Progress player ', id, player);
        });

        audios.on('timeupdate', function (event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            if (target.duration > 0) {
                var advance = 100 * target.currentTime / target.duration;
                $('.yma_player_progress_bar', player).css('width', advance + '%').removeClass('init');
            }
            var options = $('datalist option', player);
            for (var i = options.length - 1; i >= 0; i--) {
                var option = options[i];
                var index = $(option).attr('data-index');
                if (index < target.currentTime) {
                    var title = $(option).val();
                    var performer = $(option).attr('data-performer');
                    $('.yma_player_artist', player).text(performer).removeClass('single');
                    $('.yma_player_title', player).text(title);
                    break;
                }
            }
        });

        audios.on('volumechange', function (event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            var volume_bar = $('.yma_player_volume_bar', player);
            var volume_button = $('.yma_player_volume_button', player);
            var volume_bar_height = volume_bar[0].offsetHeight;
            var offset = (volume_bar_height * (1 - this.volume)) - 2;
            volume_button.css('top', offset + 'px').css('display', 'initial');
        });

        audios.each(function (index, audio) {
            audio.volume = .75;
        });

        $('.yma_player_background_bar').click(function (event) {
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            var width = event.target.offsetWidth;
            var position = event.offsetX;
            var percent = position / width;
            audio.currentTime = audio.duration * percent;
        });

        $('.yma_player_progress_bar').click(function (event) {
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            var width = event.target.offsetWidth;
            var position = event.offsetX;
            var percent = position / width;
            audio.currentTime = audio.currentTime * percent;
        });

        $('.yma_player_play_button').click(function (event) {
            event.preventDefault();
            var play_circle = $('.fa-play-circle', $(this));
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            $('.fa', $(this)).toggleClass('fa-play-circle');
            $('.fa', $(this)).toggleClass('fa-pause-circle');
            if (play_circle.length == 1) {
                console.log('Start audio');
                audio.play();
            } else {
                console.log('Pause audio');
                audio.pause();
            }
        });

        $('.yma_player_volume_bar').click(function (event) {
            var volume = 1 - (event.offsetY / event.target.offsetHeight);
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            audio.volume = volume;
        });
    });

}(window.jQuery));