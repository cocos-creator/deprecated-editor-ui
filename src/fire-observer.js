var numberIsNaN = Number.isNaN || function(value) {
    return typeof value === 'number' && isNaN(value);
};
function _fireEquals(left, right) {
    if ( left && left.equals )
        return left.equals(right);

    if ( right && right.equals )
        return right.equals(left);

    if ( left === right )
        return left !== 0 || 1 / left === 1 / right;

    if ( numberIsNaN(left) && numberIsNaN(right) )
        return true;

    return left !== left && right !== right;
}

function _FirePathObserver ( object, path ) {
    PathObserver.call(this, object, path);
}
Fire.JS.extend( _FirePathObserver, PathObserver );
_FirePathObserver.prototype.check_ = function(changeRecords, skipChanges) {
    if (!Fire.isValid(this.object_))
        return false;

    var oldValue = this.value_;
    this.value_ = this.path_.getValueFrom(this.object_);
    if (skipChanges || _fireEquals(this.value_, oldValue))
        return false;

    this.report_([this.value_, oldValue, this]);
    return true;
};

Editor._PathObserver = _FirePathObserver;
