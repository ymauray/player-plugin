(function ($) {

    'use strict';

    $(document).ready(function () {

        var audios = $('.yma_player audio');

        audios.on('progress', function (event) {
            console.log(new Date(), 'progress');
        });

        audios.on('timeupdate', function (event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            var busy = player.attr('busy');
            if ('busy' == busy) {
                return;
            }
            player.attr('busy', 'busy');
            if (target.duration > 0) {
                var advance = 100 * target.currentTime / target.duration;
                $('.yma_player_progress_button', player).css('width', advance + '%').removeClass('init');
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
            var interval = setInterval(function () {
                player.attr('busy', '');
                clearInterval(interval);
            }, 1000);
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

        $('.yma_player_progress_bar').click(function (event) {
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            var width = event.target.offsetWidth;
            var position = event.offsetX;
            var percent = position / width;
            console.log('duration: ', audio.duration);
            console.log('relative position: ', percent + '%');
            console.log('new position: ', audio.duration * percent);
            audio.currentTime = audio.duration * percent;
            console.log('error: ', audio.error);
        });

        $('.yma_player_play_button').click(function (event) {
            event.preventDefault();
            var play_circle = $('.fa-play-circle', $(this));
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            $('.fa', $(this)).toggleClass('fa-play-circle');
            $('.fa', $(this)).toggleClass('fa-pause-circle');
            if (play_circle.length == 1) {
                audio.play();
            } else {
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