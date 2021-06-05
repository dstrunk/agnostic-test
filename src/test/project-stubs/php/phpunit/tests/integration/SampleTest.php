<?php

namespace AgnosticTest\Tests\Integration;

class SampleTest extends \PHPUnit\Framework\TestCase
{
    /** @test */
    public function first_test()
    {
        $this->assertTrue(true);
    }

    /** @test */
    public function second_test()
    {
        $this->assertFalse(false);
    }
}
