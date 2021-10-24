<?php

test('asserts true is true', function () {
    expect(true)->toBeTrue();
});

it('is really true', function () {
    $this->assertTrue(true);
});
