function drawDonut(value) {
    var progress = document.getElementById('progress');
    var counter = document.getElementById('counter');
    var totalLength = progress.getTotalLength();
    var offset = totalLength * (100 - value) / 100;

    progress.style.strokeDashoffset = offset;
    counter.textContent = value + '%';
}

export default drawDonut;
